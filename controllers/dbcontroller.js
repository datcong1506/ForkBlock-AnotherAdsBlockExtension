require('dotenv').config();
const mongoose = require('mongoose');
const dbHOST=process.env.DB_HOST;



function Init(){
    console.log(`db init at ${dbHOST}`);
    mongoose.connect(dbHOST)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
}

module.exports={Init}

