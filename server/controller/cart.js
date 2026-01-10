const Cart = require('../model/Carts');
const MenuItem = require('../model/MenuItems');

async function loadPopulatedCartByUserId(userId) {
    return Cart.findOne({ userId }).populate('items.menuItem');
}

const getCartByUserId = async (req, res) => {
    try {
        const requestedUserId = req.params.userId ? String(req.params.userId) : String(req.user._id);

        // Only admins can fetch carts that aren't theirs.
        if (req.params.userId && String(req.user._id) !== requestedUserId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        let cart = await loadPopulatedCartByUserId(requestedUserId);
        if (!cart) {
            cart = await Cart.create({ userId: requestedUserId, items: [], totalAmount: 0 });
            cart = await Cart.findById(cart._id).populate('items.menuItem');
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json(error);
    }
};

const createCart = async (userId) => {
    try {
        const cart = new Cart({
            userId,
            items: [],
            totalAmount: 0
        });
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Could not create cart');
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const menuItemId = req.params.id;
        const quantityToAdd = Math.max(1, Number.parseInt(req.body?.quantity || '1', 10));

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) return res.status(400).json('Menu item not found');

        const cart = await Cart.findOne({ userId }) || await Cart.create({ userId, items: [], totalAmount: 0 });

        const existingItem = cart.items.find(i => i.menuItem?.toString() === menuItemId);
        if (existingItem) {
            existingItem.quantity += quantityToAdd;
            existingItem.price = menuItem.price;
        } else {
            cart.items.push({
                menuItem: menuItem._id,
                quantity: quantityToAdd,
                price: menuItem.price
            });
        }
        await cart.save();
        const populated = await Cart.findById(cart._id).populate('items.menuItem');
        res.status(201).json(populated);

    } catch (error) {
        res.status(400).json('Could not add to cart');
    } 
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const menuItemId = req.params.id;
        const quantityToRemove = Math.max(1, Number.parseInt(req.body?.quantity || '1', 10));
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json('Cart not found');

        const existingItem = cart.items.find(i => i.menuItem?.toString() === menuItemId);
        if (!existingItem) return res.status(400).json('Item not in cart');

        existingItem.quantity -= quantityToRemove;
        if (existingItem.quantity <= 0) {
            cart.items = cart.items.filter(i => i.menuItem?.toString() !== menuItemId);
        }
        await cart.save();
        const populated = await Cart.findById(cart._id).populate('items.menuItem');
        res.status(200).json(populated);
    } catch (error) {
        res.status(400).json('Could not remove from cart');
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json('Cart not found');

        cart.items = [];
        await cart.save();
        const populated = await Cart.findById(cart._id).populate('items.menuItem');
        res.status(200).json(populated);
    } catch (error) {
        res.status(400).json('Could not clear cart');
    }
};

module.exports = { getCartByUserId, addToCart, removeFromCart, clearCart, createCart };
