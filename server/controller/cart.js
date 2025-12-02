const Cart = require('../model/Carts');

const getCartByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId }).populate('menuItems');
        if (!cart) {
            return res.status(400).json('Cart not found');
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
            discount: 0,
            subtotal: 0,
            menuItems: []
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

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json('Cart not found');

        cart.menuItems.push(menuItemId);
        await cart.save();
        res.status(201).json(cart);

    } catch (error) {
        res.status(400).json('Could not add to cart');
    } 
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const menuItemId = req.params.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json('Cart not found');

        cart.menuItems.pull(menuItemId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json('Could not remove from cart');
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json('Cart not found');

        cart.menuItems = [];
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json('Could not clear cart');
    }
};

module.exports = { getCartByUserId, addToCart, removeFromCart, clearCart, createCart };
