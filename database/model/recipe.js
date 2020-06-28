var mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  owner: {  type: String, trim: true, required: true },
  name: {  type: String, trim: true, required: true },    
  kind: { type: String, trim: true, required: true },
  ingredients: {  type: String, trim: true, required: true }, 
  preparation: {  type: String, trim: true, required: true }, 
  picture_name: { type: String, trim: true, required: true },
  picture_type: { type: String, trim: true, required: true }, 
  picture_size: { type: Number, required: true},
  picture_data: { type: Buffer, required: true}, 
  picture_date: {type: Date, default: Date.now()}
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe