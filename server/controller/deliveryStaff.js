const DeliveryStaff = require('../model/DeliveryStaffs');
const User = require('../model/Users');

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
            employeeId: `EMP${Date.now()}`
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
        const staff = await DeliveryStaff.find().populate('userId', 'name email phone');
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeliveryStaffById = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id).populate('userId', 'name email phone').populate('Orders');
        if (!staff) {
            return res.status(404).json({ message: 'Delivery Staff not found' });
        }
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDeliveryStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Delivery Staff not found' });
        }
        res.status(200).json({ message: 'Delivery Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDeliveryStaff = async (req, res) => {
    try {
        const { status, vehicleType, vehicleMake, vehicleModel, vehicleLicensePlate } = req.body;
        const staff = await DeliveryStaff.findById(req.params.id);
        
        if (!staff) {
            return res.status(404).json({ message: 'Delivery Staff not found' });
        }

        if (status) staff.status = status;
        if (vehicleType) staff.vehicleType = vehicleType;
        if (vehicleMake) staff.vehicleMake = vehicleMake;
        if (vehicleModel) staff.vehicleModel = vehicleModel;
        if (vehicleLicensePlate) staff.vehicleLicensePlate = vehicleLicensePlate;

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
