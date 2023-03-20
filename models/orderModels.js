const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [false, 'order must have an Id.'],
  },
  items: {
    type: Array,
    maxlength: [50, 'Item name should contain no more than 50 characters'],
  },
  itemsCount: {
    type: Number,
  },
  amount: {
    type: Number,
  },

  merchant: String,
  cancelled: {
    type: Boolean,
    default: false,
  },
  fulfilled: {
    type: Boolean,
    default: false,
  },
createAt : {
  type: Date,
  default: Date.now
},
lastUpdateAt : {
  type: Date,
  default: Date.now
},
},
{ timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);