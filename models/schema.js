const mongoose = require('mongoose');

const schema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  // task_id: {
  //   type: Number,
  //   required: true
  // },
  title: {
    type: String,
    required: true
  },
  description: String,
  status:{
    type: String,
    required: true
  },
  due_date: {
    type: Date,
    required: true,
    default: Date.now
  }
});


module.exports = mongoose.model('schema', schema);


