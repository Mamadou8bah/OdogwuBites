const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Succesfully connected to a database');
    } catch (error) {
        console.error('Error connecting to DB', error);
        throw error;
    }
}
module.exports={connectToDatabase}