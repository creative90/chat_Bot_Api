const mongoose = require('mongoose');

require('dotenv').config();

const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const connectToDatabase = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Successfully connected to the database`))
    .catch((error) => console.log(`Connection Error, check this: ${error}`));
};

module.exports = connectToDatabase;

// const moogoose = require('mongoose');
// require('dotenv').config();

// const MONGODB_URI = process.env.MONGO_URL;

// // connect to mongodb
// function connectToMongoDB() {
//     moogoose.connect(MONGODB_URI);

//     moogoose.connection.on('connected', () => {
//         console.log('Connected to MongoDB successfully');
//     });

//     moogoose.connection.on('error', (err) => {
//         console.log('Error connecting to MongoDB', err);
//     })
// }

// module.exports =  connectToMongoDB ;