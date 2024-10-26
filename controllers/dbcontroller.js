require('dotenv').config();
const { MongoClient } = require('mongodb');

const dbHOST=process.env.DB_HOST;

const client = new MongoClient(dbHOST);


function Init(){
    client.connect(err=>{
        if (err) {
            console.error('Failed to connect to the database. Error:', err);
          } else {
            console.log('Connected successfully to the database');
            const collection = client.db(process.env.DB_NAME).collection('test');
            // perform actions on the collection object
            client.close();
          }
    });
}

module.exports={Init}

