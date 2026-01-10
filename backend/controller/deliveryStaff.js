const DeliveryStaff = require('../model/DeliveryStaffs');
const User = require('../model/Users');

const PER_ASSIGNED_ORDER_EARNING = 50;

const syncStaffEarningsToUserBalance = async (staffDoc) => {
    if (!staffDoc) return { assignedOrdersCount: 0, totalEarnings: 0, newlyCredited: 0 };

    const assignedOrdersCount = Array.isArray(staffDoc.Orders) ? staffDoc.Orders.length : 0;
    const paidOrdersCount = Math.max(0, Number(staffDoc.paidOrdersCount || 0));

    const totalEarnings = assignedOrdersCount * PER_ASSIGNED_ORDER_EARNING;
    const unpaidOrdersCount = Math.max(0, assignedOrdersCount - paidOrdersCount);
    const newlyCredited = unpaidOrdersCount * PER_ASSIGNED_ORDER_EARNING;

    if (unpaidOrdersCount > 0) {
        const userId = staffDoc.userId && typeof staffDoc.userId === 'object'
            ? (staffDoc.userId._id || staffDoc.userId.id)
            : staffDoc.userId;

        if (userId) {
            await User.findByIdAndUpdate(userId, { $inc: { balance: newlyCredited } });
            staffDoc.paidOrdersCount = assignedOrdersCount;
            await staffDoc.save();
        }
    }

    return { assignedOrdersCount, totalEarnings, newlyCredited };
};

const createDeliveryStaff = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email not found' });
        }

        const existingStaff = await DeliveryStaff.findOne({ userId: user._id });
        if (existingStaff) {
            return res.status(400).json({ message: 'User is already a delivery staff' });
        }

        const newStaff = new DeliveryStaff({ 
            userId: user._id,
            employeeId: `EMP${Date.now()}`,
            // Ensure vehicle exists so UI can show defaults.
            vehicle: { type: 'motorcycle' }
        });
        await newStaff.save();

        user.role = 'staff';
        await user.save();

        res.status(201).json(newStaff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDeliveryStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.find().populate('userId', 'name email phone address balance');

        const enriched = [];
        for (const s of staff) {
            const earnings = await syncStaffEarningsToUserBalance(s);
            enriched.push({
                ...(typeof s.toObject === 'function' ? s.toObject() : s),
                assignedOrdersCount: earnings.assignedOrdersCount,
                totalEarnings: earnings.totalEarnings
            });
        }

        res.status(200).json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
};

const getDeliveryStaffById = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id)
            .populate('userId', 'name email phone address balance')
            .populate('Orders');
        if (!staff) {
            return res.status(404).json({ message: 'Delivery Staff not found' });
        }

        const earnings = await syncStaffEarningsToUserBalance(staff);
        res.status(200).json({
            ...(typeof staff.toObject === 'function' ? staff.toObject() : staff),
            assignedOrdersCount: earnings.assignedOrdersCount,
            totalEarnings: earnings.totalEarnings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDeliveryStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Delivery Staff not found' });
        }

        // Reset user role back to 'user'
        await User.findByIdAndUpdate(staff.userId, { role: 'user' });

        await DeliveryStaff.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Delivery Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDeliveryStaff = async (req, res) => {
    try {
        const {
            status,
            employmentType,
            vehicleType,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            vehicleLicensePlate,
            vehicle
        } = req.body;
        const staff = await DeliveryStaff.findById(req.params.id);
        
        if (!staff) {
            return res.status(404).json({ message: 'Delivery Staff not found' });
        }

        if (status) staff.status = status;
        if (employmentType) staff.employmentType = employmentType;
        
        if (!staff.vehicle) staff.vehicle = {};
        // Support both flat fields and a nested `vehicle` object payload.
        const v = vehicle && typeof vehicle === 'object' ? vehicle : {};

        const nextType = vehicleType ?? v.type;
        const nextMake = vehicleMake ?? v.make;
        const nextModel = vehicleModel ?? v.model;
        const nextYear = vehicleYear ?? v.year;
        const nextPlate = vehicleLicensePlate ?? v.licensePlate;

        if (nextType) staff.vehicle.type = nextType;
        if (nextMake) staff.vehicle.make = nextMake;
        if (nextModel) staff.vehicle.model = nextModel;
        if (nextYear != null && nextYear !== '') staff.vehicle.year = Number(nextYear);
        if (nextPlate) staff.vehicle.licensePlate = nextPlate;

        await staff.save();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDeliveryStaff,
    getAllDeliveryStaff,
    getDeliveryStaffById,
    deleteDeliveryStaff,
    updateDeliveryStaff
};
