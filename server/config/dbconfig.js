const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/odogwuBites');
        console.log('Succesfully connected to a database');
    } catch (error) {
        console.error('Error connecting to DB', error);
        throw error;
    }
}
module.exports={connectToDatabase}