var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var productSchema = mongoose.Schema({      
  description: String,
  investment: Number
});


var advertiserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    product: [productSchema]
});

advertiserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

advertiserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Advertiser', advertiserSchema);
