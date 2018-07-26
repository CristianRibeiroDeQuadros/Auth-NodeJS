var express = require('express');
var Advertiser = require('../models/advertiser');

var router = express.Router();
var advertiserRouter = express.Router();
var productRouter = express.Router();

//set up routes
router.use('/advertiser', advertiserRouter);
router.use('/product', productRouter);

//Register a new advertiser
advertiserRouter.post('/signup', function(req, res){  
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;
  Advertiser.findOne({ 'email':  email }, function(err, advertiser) {
    if (err)
        return done(err);
    if (advertiser) {
      res.statusMessage = 'Já existe um anunciante cadastrado para este email!';
      return res.sendStatus(302).end();      
    } else {
      var newAdvertiser = new Advertiser();
      newAdvertiser.firstName = firstName;
      newAdvertiser.lastName = lastName;
      newAdvertiser.email = email;
      newAdvertiser.password = newAdvertiser.generateHash(password);
      newAdvertiser.save(function(err) {
        if (err)
          throw err;
        return res.json('Anunciante cadastrado com sucesso!');
      });
    }
  });
});

//list all advertiser with their respectives products
advertiserRouter.get('/lista', function(req, res, next) {
  Advertiser.find()  
    .then(advertisers => {
        res.send(advertisers);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
});

//delete advertiser by id
advertiserRouter.delete('/delete/:advertiserId', function(req, res){  
  Advertiser.findByIdAndRemove(req.params.advertiserId)
    .then(advertiser => {
        if(!advertiser) {
            return res.status(404).send({
                message: "Advertiser not found with id " + req.params.advertiserId
            });
        }
        res.send({message: "Advertiser deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Advertiser not found with id " + req.params.advertiserId
            });                
        }
        return res.status(500).send({
            message: "Could not delete advertiser with id " + req.params.advertiserId
        });
    });
});

//register a product for an already registered advertiser
productRouter.post('/register', function(req, res){
  var email       = req.body.email,
      description = req.body.description,
      investment  = req.body.investment;
  
  Advertiser.findOne({ email: email }, function(err, advertiser) {
    if (err)
        return done(err);
    if (advertiser) {
      advertiser.product.push({
        description: description,
        investment: investment
      });
      advertiser.save(function(err) {
        if (err)
            throw err;
        return res.json(advertiser);
      });

    } else {
      res.json('Não há anunciante');
    }
  });
});

module.exports = router;