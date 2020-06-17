var mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  kind: {
    type: String,
    trim: true,
    required: true,
  },
  ingredients: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  preparation: { 
    type: String, 
    trim: true, 
    required: true,
  },
  picture : {
    type: Buffer,
    required: true,
  }
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe