const Category = require('../model/Categories');

const DEFAULT_CATEGORIES = [
    {
        name: 'Rice',
        description: 'Rice dishes',
    },
    {
        name: 'Pasta',
        description: 'Pasta dishes',
    },
    {
        name: 'Noodles',
        description: 'Noodles and stir-fries',
    },
    {
        name: 'Swallow',
        description: 'Swallow meals',
    },
    {
        name: 'Soups',
        description: 'Soups and stews',
    },
    {
        name: 'Sauce',
        description: 'Sauces and stews',
    },
    {
        name: 'Snacks',
        description: 'Snacks and small chops',
    },
    {
        name: 'Desserts',
        description: 'Desserts and sweet treats',
    },
    {
        name: 'Drinks',
        description: 'Beverages',
    },
    {
        name: 'Protein',
        description: 'Meat, fish, eggs, and sides',
    },
    {
        name: 'Seafood',
        description: 'Fish and seafood meals',
    },
    {
        name: 'Chicken',
        description: 'Chicken meals and sides',
    },
    {
        name: 'Beef',
        description: 'Beef meals and sides',
    },
    {
        name: 'Vegetarian',
        description: 'Vegetarian meals',
    },
    {
        name: 'Breakfast',
        description: 'Breakfast meals',
    }, 
    {
        name: 'Combos',
        description: 'Meal combos',
    },
];

async function seedCategories() {
    try {
       
        for (const category of DEFAULT_CATEGORIES) {
            await Category.updateOne(
                { name: category.name },
                { $setOnInsert: category },
                { upsert: true }
            );
        }

        const count = await Category.countDocuments();
        console.log(`Categories ready (${count})`);
    } catch (error) {
        console.error('Category seeding failed', error);
    }
}

module.exports = { seedCategories, DEFAULT_CATEGORIES };
