
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

exports.signin = function(req, res){
	res.render('signin', { title: 'Login to your Account' })
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

exports.features = function(req, res){
	res.render('features', { title: 'Features' })
};

exports.services = function(req, res){
	res.render('services', { title: 'Services' })
};

exports.reset = function(req, res){
	res.render('reset', { title: 'Reset Your Password' })
};

exports.pricing = function(req, res){
	res.render('pricing', { title: 'Pricing' })
};

exports.blog = function(req, res){
	res.render('blog', { title: 'Blog' })
};