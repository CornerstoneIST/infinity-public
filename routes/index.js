var
  config = require('../config/config').config,
  MailService = require('../services/Mail');
  User = require('../schemas/user');

exports.index = function (req, res) {
  res.render('index')
};

exports.newuser = function (req, res) {
  if (req.body.password != req.body.confPassword) {
    res.send('Passwords must match', 400);
    return;
  }
  var user = new User(req.body);
  user.type = 'owner'
  user.save(function (err, user) {
    if (err) {
      console.error(err);
      res.send(['error saving User', err], 500);
      return;
    }
    MailService.sendUserRegisterMail(user);
    req.session.user_id = user._id;
    res.send(user);
  })
};
exports.logout = function (req, res, next) {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/signin');
};

exports.checkUser = function (req, res, next) {
  if (req.session && req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (err || !user) {
        console.error(err);
        res.send('User not found', 401);
        return;
      }
      if (user.type == 'owner') {
        res.send('User found', 200);
      } else {
        res.send('User access denied', 401);
      }
    });
  } else {
    res.send('User not found', 401);
  }
};

exports.setUser = function (req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err || !user) {
      console.error(err);
      res.send('User not found', 400);
      return;
    }
    if (user && user.password == req.body.password) {
      req.session.user_id = user._id;
      res.send('User found', 200);
    } else {
      res.send('User not found', 401);
    }
  });
};
//
exports.privacypolicy = function (req, res) {
	res.render('privacypolicy', { title: 'Privacy Policy' })
};

exports.termsofservice = function(req, res){
	res.render('termsofservice', { title: 'Terms of Service' })
};

exports.forgotpassword = function(req, res){
	res.render('forgotpassword', { title: 'Recover your Password' })
};

exports.reset = function(req, res){
	res.render('reset', { title: 'Reset Your Password' })
};
