var express = require('express');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var passport = require('passport');

var router = express.Router();
var userRouter = express.Router();
var googleRouter = express.Router();


//fixando a rota /user para todas as rotas referentes ao usuario
router.use('/user', userRouter);
router.use('/user/google', googleRouter);

userRouter.get('/profile', logginrequired, function(req, res) {
  decodeToken(req, res);
});

userRouter.get('/checkAuthentication', logginrequired, function(req, res) {
  decodeToken(req, res);
});

userRouter.post('/signup', function(req, res){  
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ 'local.email':  email }, function(err, user) {
    if (err)
        return done(err);
    if (user) {      
      res.statusMessage = 'Já existe um usuário cadastrado para este email!';
      return res.sendStatus(302).end();      
    } else {
      var newUser = new User();
      newUser.local.email = email;
      newUser.local.password = newUser.generateHash(password);
      newUser.save(function(err) {
        if (err)
          throw err;
        return res.json('Usuário criado com sucesso!');
      });
    }
  });
});

userRouter.post('/login', function(req, res){
  User.findOne({
    'local.email': req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({message: 'usuario nao existe'});
    } else if (user) {
      if (!user.validPassword(req.body.password)) {        
        res.status(401).json({message: 'usuario nao existe'});
      } else {
        console.log('login sucesso');
        jwt.sign({user}, secret.database.secret, function(err, token){
          res.json({
            token
          })
        });
      }
    }
  });
});

userRouter.get('/lista', function(req, res, next) {
  User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
});

function logginrequired (req, res, next) {
  const jwtHeader = req.headers['authorization'];
  if(typeof jwtHeader !== 'undefined'){
    const bearer = jwtHeader.split(' ')[1];
    req.token = bearer;
    next();
  }else{
    res.statusMessage = 'nao autorizado';
    res.sendStatus(403).end();
  }
};

function decodeToken(req, res){
  jwt.verify(req.token, secret.secret, (err, authData) => {
    if(err){
      res.statusMessage = 'Não Autorizado';
      res.sendStatus(403).end();
    }
    else{
      res.json({message:'Autorizado', authData});      
    }
  });
};

//------------------------------------------- Google authentication -------------------------
googleRouter.get('/login', passport.authenticate('google', {
  scope: ['profile']
}));

googleRouter.get('/redirect', function(req, res){
  res.json('tudo certo');
});


module.exports = router;