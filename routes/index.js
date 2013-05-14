
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home' })
};

exports.contact = function(req, res){
	res.render('contact', { title: 'Contact' })
};

exports.about = function(req, res){
	res.render('about', { title: 'About Us' })
};

exports.signup = function(req, res){
	res.render('signup', { title: 'Sign Up' })
};

exports.login = function(req, res){
	res.render('login', { title: 'Login to your Account' })
};

exports.privacypolicy = function(req, res){
	res.render('privacypolicy', { title: 'Privacy Policy' })
};

exports.termsofservice = function(req, res){
	res.render('termsofservice', { title: 'Terms of Service' })
};

exports.forgotpassword = function(req, res){
	res.render('forgotpassword', { title: 'Recover your Password' })
};