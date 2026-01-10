const MenuItem = require('../model/MenuItems');
const Category = require('../model/Categories');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');

const resolveCategoryIdFromName = async (name) => {
    if (!name) return null;
    const category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    return category ? category._id : null;
};

const createMenuItem = async (req, res) => {
    try {
        const { categoryName, price, discount, isAvailable, ...rest } = req.body;
        const categoryId = await resolveCategoryIdFromName(categoryName);
        if (!categoryId) {
            return res.status(400).json('Invalid categoryName');
        }

        const menuItem = new MenuItem({
            ...rest,
            price: Number(price),
            discount: discount ? Number(discount) : 0,
            isAvailable: isAvailable === 'true' || isAvailable === true,
            categoryId,
        });

        const image = req.file;
        if (!image) {
            return res.status(400).json('Image is required');
        }
        if (image) {
            const uploadResult = await uploadToCloudinary(image.buffer, 'menu_items');
            menuItem.imageUrl = uploadResult.secure_url;
        }

        console.log(menuItem.imageUrl);
        await menuItem.save();
        const created = await MenuItem.findById(menuItem._id).populate('categoryId', 'name description');
        res.status(201).json(created);
    } catch (error) {
        console.error(error);
        res.status(400).json('Error creating menu item');
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const id = req.params.id;
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(400).json('Menu Item not found');
        }
        await MenuItem.findByIdAndDelete(id);
        res.status(202).json('Menu Item deleted Succesfully');
    } catch (error) {
        res.status(400).json('Error Deleting Item');
    }
};

const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().populate('categoryId', 'name description');
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(400).json('Error fetching menu items');
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const menuItem = await MenuItem.findById(id).populate('categoryId', 'name description');
        if (!menuItem) {
            return res.status(400).json('Menu Item not found');
        }
        res.status(200).json(menuItem);
    } catch (error) {
        res.status(400).json('Error fetching menu item');
    }
};

const getMenuItemByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const menuItems = await MenuItem.find({ categoryId }).populate('categoryId', 'name description');
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(400).json('Error fetching menu items by category');
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = { ...req.body };
        const image = req.file;

        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json('Menu Item not found');
        }

        // Handle numeric fields from multipart form
        if (updates.price) updates.price = Number(updates.price);
        if (updates.discount) updates.discount = Number(updates.discount);
        if (updates.isAvailable) updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true;

        if (updates.categoryName) {
            const categoryId = await resolveCategoryIdFromName(updates.categoryName);
            if (!categoryId) {
                return res.status(400).json('Invalid categoryName');
            }
            updates.categoryId = categoryId;
            delete updates.categoryName;
        }

        if (image) {
            const uploadResult = await uploadToCloudinary(image.buffer, 'menu_items');
            updates.imageUrl = uploadResult.secure_url;
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, updates, { 
            new: true,
            runValidators: true 
        }).populate('categoryId', 'name description');
        
        res.status(200).json(updatedMenuItem);
    } catch (error) {
        console.error('Update Error:', error);
        res.status(400).json({ message: 'Error updating menu item', error: error.message });
    }
};

const searchMenuItems = async (req, res) => {
    try {
        const query = req.query;
        const menuItems = await MenuItem.find({
            $or: [
                { title: { $regex: query.q, $options: 'i' } },
                { description: { $regex: query.q, $options: 'i' } },
            ],
        }).populate('categoryId', 'name description');
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(400).json('Search Failed');
    }
};

module.exports = {
    createMenuItem,
    deleteMenuItem,
    getAllMenuItems,
    getMenuItemById,
    getMenuItemByCategory,
    updateMenuItem,
    searchMenuItems,
};