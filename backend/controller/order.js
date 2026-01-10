const Order=require('../model/Orders');
const Payment = require('../model/Payments');
const DeliveryStaff = require('../model/DeliveryStaffs');
const User = require('../model/Users');

const Cart = require('../model/Carts');

const normalizeOrderForClient = (orderDoc) => {
    if (!orderDoc) return orderDoc;
    // toObject({ virtuals: true }) ensures that virtual fields like 'total' are included,
    // and that populated fields are converted to plain objects.
    const raw = typeof orderDoc.toObject === 'function' ? orderDoc.toObject({ virtuals: true }) : orderDoc;

    if (raw.items && Array.isArray(raw.items)) {
        raw.items = raw.items.map(item => ({
            ...item,
            // Provide a fallback in case the population field name differs from the schema field name
            menuItemId: item.menuItemId || item.menuItem
        }));
    }

    const user = raw.userId && typeof raw.userId === 'object' ? raw.userId : undefined;

    let deliveryStaff = raw.deliveryStaffId && typeof raw.deliveryStaffId === 'object' ? raw.deliveryStaffId : undefined;
    if (deliveryStaff && deliveryStaff.userId && typeof deliveryStaff.userId === 'object') {
        deliveryStaff = {
            ...deliveryStaff,
            fullname: deliveryStaff.userId?.name || deliveryStaff.fullname
        };
    }

    return {
        ...raw,
        user,
        deliveryStaff,
        orderDate: raw.createdAt || raw.createdAt,
    };
};

const populateOrderQuery = (q) => q
    .populate('userId')
    .populate('items.menuItemId')
    .populate('menuItems')
    .populate({ 
        path: 'deliveryStaffId', 
        populate: { path: 'userId', select: 'name email' } 
    });

const assertOrderAccess = (reqUser, order) => {
    if (!order) return { ok: false, status: 404, message: 'No order with such ID' };
    if (reqUser.role === 'admin') return { ok: true };
    const orderUserId = order.userId && typeof order.userId === 'object'
        ? (order.userId._id || order.userId.id)
        : order.userId;

    if (String(orderUserId) !== String(reqUser._id)) {
        return { ok: false, status: 403, message: 'Forbidden' };
    }
    return { ok: true };
};

const createOrder=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {
            deliveryFee,
            paymentMethod,
            deliveryType,
            notes,
            address,
            phone,
            city,
            postalCode,
            clientRequestId
        } = req.body || {};

        const method = ['Wallet', 'Online', 'Cash'].includes(paymentMethod) ? paymentMethod : 'Wallet';
        const type = ['Pickup', 'Delivery'].includes(deliveryType) ? deliveryType : 'Delivery';
        const fee = Math.max(0, Number(deliveryFee || 0));

        if (type === 'Delivery') {
            if (!String(address || '').trim() || !String(phone || '').trim()) {
                return res.status(400).json({ message: 'Delivery address and phone are required' });
            }
        }

        // Optional idempotency: if the same request is repeated, return the existing order.
        if (clientRequestId) {
            const existing = await populateOrderQuery(Order.findOne({ userId, clientRequestId }));
            if (existing) {
                return res.status(200).json({ message: 'Order already created', order: normalizeOrderForClient(existing) });
            }
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const cart = await Cart.findOne({ userId }).populate('items.menuItem');
        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const items = cart.items.map((it) => {
            const menuItem = it.menuItem;
            const title = menuItem?.title || 'Item';
            const unitPrice = Number(menuItem?.price ?? it.price ?? 0);
            const quantity = Math.max(1, Number(it.quantity ?? 1));
            const subTotal = unitPrice * quantity;
            return {
                menuItemId: menuItem?._id ?? it.menuItem,
                title,
                unitPrice,
                quantity,
                subTotal
            };
        });

        const itemsTotal = items.reduce((sum, it) => sum + (Number(it.subTotal) || 0), 0);
        const totalOrderAmount = itemsTotal + fee;

        if (method === 'Wallet') {
            if ((user.balance || 0) < totalOrderAmount) {
                return res.status(400).json({ message: 'Insufficient amount in wallet' });
            }
            user.balance = (user.balance || 0) - totalOrderAmount;
            await user.save();
        }

        const order = new Order({
            userId,
            clientRequestId: clientRequestId ? String(clientRequestId) : undefined,
            items,
            deliveryFee: fee,
            paymentMethod: method,
            notes: notes || '',
            deliveryType: type,
            address: address || '',
            phone: phone || '',
            city: city || '',
            postalCode: postalCode || ''
        });

        if (type === 'Delivery') {
            const staffMembers = await DeliveryStaff.find({}).populate('userId');
            if (staffMembers.length > 0) {
                staffMembers.sort((a, b) => (a.Orders?.length || 0) - (b.Orders?.length || 0));
                const selectedStaff = staffMembers[0];

                order.deliveryStaffId = selectedStaff._id;
                selectedStaff.Orders = Array.isArray(selectedStaff.Orders) ? selectedStaff.Orders : [];
                selectedStaff.Orders.push(order._id);
                await selectedStaff.save();
            }
        }

        await order.save();

        const paymentStatus = method === 'Wallet' ? 'Completed' : 'Pending';
        const paymentNotes = method === 'Wallet'
            ? 'Paid via Wallet'
            : (method === 'Cash' ? 'Pay on delivery' : 'Online payment pending');

        const payment = await Payment.create({
            userId,
            orderId: order._id,
            amount: order.total,
            paymentMethod: method,
            paymentStatus,
            notes: paymentNotes
        });

        // Clear cart after successful order creation.
        cart.items = [];
        await cart.save();

        const populated = await populateOrderQuery(Order.findById(order._id));
        res.status(200).json({
            message: 'Order placed successfully',
            order: normalizeOrderForClient(populated),
            payment
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Order Failed' })
    }
}
const getOrdersByUserId=async(req,res)=>{
    try{
        const userId=req.user._id;
        const q = populateOrderQuery(Order.find({userId:userId}).sort({ createdAt: -1 }));
        const orders=await q;
        res.status(200).json(orders.map(normalizeOrderForClient))
    }catch(error){
        res.status(400).json(error)
    }
}

const getMyAssignedOrders = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findOne({ userId: req.user._id });
        if (!staff) {
            return res.status(404).json({ message: 'Delivery staff not found' });
        }

        const q = populateOrderQuery(
            Order.find({ deliveryStaffId: staff._id }).sort({ createdAt: -1 })
        );
        const orders = await q;
        res.status(200).json(orders.map(normalizeOrderForClient));
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
};

const cancelOrder=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId);
        const access = assertOrderAccess(req.user, order);
        if (!access.ok) return res.status(access.status).json({ message: access.message });

        if (order.status === 'Delivered') {
            return res.status(400).json({ message: 'Delivered orders cannot be cancelled' });
        }
        if (order.status === 'Cancelled') {
            return res.status(200).json({ message: 'Order already cancelled' });
        }

        order.status='Cancelled';
        await order.save();

        // Refund wallet payments when cancelling.
        if (order.paymentMethod === 'Wallet') {
            const payment = await Payment.findOne({ orderId: order._id, paymentMethod: 'Wallet' }).sort({ createdAt: -1 });
            if (payment && (payment.paymentStatus === 'Completed' || payment.paymentStatus === 'Paid')) {
                const user = await User.findById(order.userId);
                if (user) {
                    user.balance = (user.balance || 0) + (order.total || 0);
                    await user.save();
                }
                payment.paymentStatus = 'Refunded';
                payment.notes = `${payment.notes || ''}${payment.notes ? ' | ' : ''}Refunded on cancel`;
                await payment.save();
            }
        }

        res.status(200).json({ message: 'Order Cancelled successfully' })

    }catch(error){
        res.status(400).json(error)
    }
}

const acceptOrder=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message: 'No order with such ID' })
        }
        if (order.status !== 'Pending') {
            return res.status(400).json({ message: `Cannot accept order in status ${order.status}` });
        }
        order.status='Accepted';
        await order.save();
        res.status(200).json({ message: 'Order Accepted successfully' })
    }catch(error){
        res.status(400).json(error)
    }
}
const deliverOrder=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message: 'No order with such ID' })
        }

        if (order.status !== 'Accepted') {
            return res.status(400).json({ message: `Cannot deliver order in status ${order.status}` });
        }

        // Staff can only deliver orders assigned to them.
        if (req.user.role !== 'admin') {
            const staff = await DeliveryStaff.findOne({ userId: req.user._id });
            if (!staff || !order.deliveryStaffId || String(staff._id) !== String(order.deliveryStaffId)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }

        order.status='Delivered';
        await order.save();

        // Mark cash payments as completed on delivery.
        if (order.paymentMethod === 'Cash') {
            const payment = await Payment.findOne({ orderId: order._id, paymentMethod: 'Cash' }).sort({ createdAt: -1 });
            if (payment && payment.paymentStatus === 'Pending') {
                payment.paymentStatus = 'Completed';
                payment.notes = `${payment.notes || ''}${payment.notes ? ' | ' : ''}Completed on delivery`;
                await payment.save();
            }
        }

        res.status(200).json({ message: 'Order Delivered successfully' })
    }catch(error){
        res.status(400).json(error)
    }
}
const getAllOrders=async(req,res)=>{
    try{
        const q = populateOrderQuery(Order.find().sort({ createdAt: -1 }));
        const orders=await q;
        res.status(200).json(orders.map(normalizeOrderForClient))
    }catch(error){
        res.status(400).json(error)
    }
}

const getOrderById=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await populateOrderQuery(Order.findById(orderId));

        if (!order) return res.status(404).json({ message: 'No order with such ID' });

        if (req.user.role === 'admin') {
            return res.status(200).json(normalizeOrderForClient(order));
        }

        if (req.user.role === 'staff') {
            const staff = await DeliveryStaff.findOne({ userId: req.user._id });
            const orderStaffId = order.deliveryStaffId && typeof order.deliveryStaffId === 'object'
                ? (order.deliveryStaffId._id || order.deliveryStaffId.id)
                : order.deliveryStaffId;

            if (!staff || !orderStaffId || String(staff._id) !== String(orderStaffId)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            return res.status(200).json(normalizeOrderForClient(order));
        }

        const access = assertOrderAccess(req.user, order);
        if (!access.ok) return res.status(access.status).json({ message: access.message });
        res.status(200).json(normalizeOrderForClient(order))
    }catch(error){
        res.status(400).json(error)
    }
}
module.exports={createOrder,getOrdersByUserId,getMyAssignedOrders,cancelOrder,acceptOrder,deliverOrder,getAllOrders,getOrderById}