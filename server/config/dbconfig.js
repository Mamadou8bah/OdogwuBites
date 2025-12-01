const mongoose = require('mongoose');
function connectToDatabase() {
    mongoose.connect('mongodb://localhost:27017/odogwuBites')
    .then(
        ()=>{
            console.log('Succesfully connected to a database')
        }
    )
    .catch(
        (Error)=>{
            console.error('Error connecting to DB',Error)
        }
    )
}
module.exports={connectToDatabase}