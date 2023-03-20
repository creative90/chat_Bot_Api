const items = [
  {
    id: 1,
    item: 'iPhone 15 pro max',
    description: 'Apple company latest flagish phone',
    amount: 1500,
  },
  {
    id: 2,
    item: 'Microsoft surface pro 7',
    description: 'Microsoft latest flagish PC for developers',
    amount: 2100,
  },
  {
    id: 3,
    item: 'Bible (king James Version)',
    description: 'The Holy Bible of GOD in king James version',
    amount: 40,
  },
  {
    id: 4,
    item: 'Macbook pro 2023',
    description:
      'Apple company latest flagish PC for high end design and web development',
    amount: 2800,
  },
  {
    id: 5,
    item: 'Airpods pro 2',
    description: 'Apple company latest flagish quality airpods',
    amount: 250,
  },
  {
    id: 6,
    item: 'Mercedez Benz G-wagon',
    description: 'The new s-class model from Benz',
    amount: 88000,
  },
  {
    id: 7,
    item: 'Ring Light (RGB)',
    description: 'Multi-colored ring light.',
    amount: 80,
  },
  {
    id: 8,
    item: 'Xiaomi Redmi Note 12 pro',
    description: 'Xiaomi alternate flagish phone',
    amount: 1000,
  },
  {
    id: 9,
    item: 'Starlink (wifi-router)',
    description: 'New wifi-router from space X',
    amount: 3500,
  },
  {
    id: 10,
    item: 'Tesla model X (S-plaid)',
    description: 'Latest tesla model electric car',
    amount: 100000,
  },
];

module.exports = items;

// const mongoose = require('mongoose');


// //Define a schema
// const Schema = mongoose.Schema;

// //Define book schema
// const itemSchema = new Schema({

//   id: {
//     type: Number,
//     required: [false, 'order must have an Id.'],
//   },
//   item: {
//     type: String,
//     required: [true, 'User must input a username'],
   
//   },
//   description: {
//     type: String,
//     required: [true, 'User must input a decription'],
//   },
//   amount: {
//     type: Number,
//   },
  
// createAt : {
//   type: Date,
//   default: Date.now
// },
// lastUpdateAt : {
//   type: Date,
//   default: Date.now
// },
// });

// module.exports = mongoose.model("Items", itemSchema);