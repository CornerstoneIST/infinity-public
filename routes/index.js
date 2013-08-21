var config = require('../config/config').config
  , bcrypt = require('bcrypt')
  , MailService = require('../services/Mail')
  , User = require('../schemas/user');

exports.index = function (req, res) {
  res.render('index')
};

exports.newuser = function (req, res) {
  if (req.body.password != req.body.confPassword) {
    res.send('Passwords must match', 400);
    return;
  }
  if (req.body.password.length <= 5) {
    res.send('Password should be at least 6 characters', 400);
    return;
  }
  User.find({
    email: req.body.email,
    type: 'owner'
  }).count(function (err, count) {
    if (err) {
      console.error(err);
    }
    if (count > 0) {
      res.send('This email is in use', 500);
      return;
    } else {
      var user = new User(req.body);
      bcrypt.hash(req.body.password, 8, function(err, hash) {
        user.type = 'owner';
        user.password = hash;
        user.save(function (err, user) {
          if (err) {
            console.error(err);
            if (err.code == 11000) {
            }
            res.send(['error saving User', err], 500);
            return;
          }
          MailService.sendUserRegisterMail(user);
          req.session.user_id = user._id;
          res.send(user);
        })
      })
    }
  });
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
      res.send('User found', 200);
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
    if (!user.password) {
      res.send('User is not activated', 401);
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, ans) {
        if (err) throw err;
        if (ans) {
          req.session.user_id = user._id;

          if (user.type == 'owner') {
            res.json({
              redirect: true,
              url: config.adminUrl
            });
            return;
          } else {
            res.send('User found', 200);
          }

        } else {
          res.send('Wrong password', 401);
        }
      });
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
