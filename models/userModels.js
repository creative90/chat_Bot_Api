const mongoose = require('mongoose');


//Define a schema
const Schema = mongoose.Schema;

//Define book schema
const userSchema = new Schema({


  username: {
    type: String,
    required: [true, 'User must input a username'],
  },
  password: {
    type: String,
    required:true,
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

module.exports = mongoose.model("Users", userSchema);