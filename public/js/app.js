App = new Backbone.Marionette.Application();
var ModalRegion = Backbone.Marionette.Region.extend({
  el: "#modal",
  constructor: function () {
    Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
    this.on("show", this.showModal, this);
  },

  getEl: function (selector) {
    var $el = $(selector);
    $el.on("hidden", this.close);
    return $el;
  },

  showModal: function (view) {
    view.on("close", this.hideModal, this);
    this.$el.modal('show');
  },

  hideModal: function () {
    this.$el.modal('hide');
  }
});
App.addRegions({
  menu: ".navbar",
  content: "#content",
  modal: ModalRegion
});

var
  MenuView = Backbone.Marionette.View.extend({
    el: ".navbar",
  
    events: {
      'click a': function (e) {
        e.preventDefault();
        this[$(e.currentTarget).attr('href')]();
        return false;
      }
    },
    setActive: function (href) {
      var
        item = this.$('a[href=' + href +']');
      this.$('.nav a').removeClass('active');
      item.addClass('active');
      $('head title').text(item.text());
    },
    home: function () {
      this.$('.nav a').removeClass('active');
      $('head title').text('Home');
      App.content.show(new HomeView());
      Backbone.history.navigate('home');
    },
    about: function () {
      this.setActive('about');
      App.content.show(new AboutView());
      Backbone.history.navigate('about');
    },
    features: function () {
      this.setActive('features');
      App.content.show(new FeaturesView());
      Backbone.history.navigate('features');
    },
    services: function () {
      this.setActive('services');
      App.content.show(new ServicesView());
      Backbone.history.navigate('services');
    },
    signup: function () {
      this.setActive('signup');
      App.content.show(new SignupView());
      Backbone.history.navigate('signup');
    },
    signin: function () {
      this.$('.nav a').removeClass('active');
      $('head title').text('SIGN IN');
      App.content.show(new SigninView());
      Backbone.history.navigate('signin');
    },
    pricing: function () {
      this.setActive('pricing');
      App.content.show(new PricingView());
      Backbone.history.navigate('pricing');
    },
    contact: function () {
      this.setActive('contact');
      App.content.show(new ContactView());
      Backbone.history.navigate('contact');
    },
    blog: function () {
      this.setActive('blog');
      App.content.show(new BlogView());
      Backbone.history.navigate('blog');
    },
    reset: function () {
      this.$('.nav a').removeClass('active');
      $('head title').text('RESET');
      App.content.show(new ResetView());
      Backbone.history.navigate('reset');
    },
    notFound: function () {
      this.$('.nav a').removeClass('active');
      $('head title').text('Not Found');
      App.content.show(new NotFoundView());
    },
    logout: function () {
      var options = {
          type: 'post',
          url: '/api/logout',
          success: function (expl, status, data) {
            if (data.status == 200) {
              me.$('a[href=logout]').attr('href', 'signup').text('SIGNUP');
            }
          },
          error: function () {
            console.log(arguments);
          }
        }, me = this;
      $.ajax(options);
    },
    checkUser: function () {
      var options = {
          type: 'get',
          url: '/api/check-user',
          success: function (expl, status, data) {
            if (data.status == 200) {
              me.$('a[href=signup]').attr('href', 'logout').text('LOGOUT');
            }
          }
        }, me = this;
      $.ajax(options);
    }
  }),
  HomeView = Backbone.Marionette.ItemView.extend({
    template: "#home-template",
    onShow: function () {
      $.indexslider();
    }
  }),
  AboutView = Backbone.Marionette.ItemView.extend({
    template: "#about-template",
    onShow: function () {
      var servicesCircle = {
        initialize: function () {
            var $container = $(".services_circles");
            var $texts = $container.find(".description .text");
            var $circles = $container.find(".areas .circle");
    
            $circles.click(function () {
                var index = $circles.index(this);
                $texts.fadeOut();
                $texts.eq(index).fadeIn();
                $circles.removeClass("active");
                $(this).addClass("active");
            });
        }
      };
      servicesCircle.initialize();

    // Flex
      this.$('.flexslider').flexslider();
    }
  }),
  FeaturesView = Backbone.Marionette.ItemView.extend({
    template: "#features-template",
  }),
  ServicesView = Backbone.Marionette.ItemView.extend({
    template: "#services-template",
    onShow: function () {
      var servicesCircle = {
        initialize: function () {
            var $container = $(".services_circles");
            var $texts = $container.find(".description .text");
            var $circles = $container.find(".areas .circle");
    
            $circles.click(function () {
                var index = $circles.index(this);
                $texts.fadeOut();
                $texts.eq(index).fadeIn();
                $circles.removeClass("active");
                $(this).addClass("active");
            });
        }
      };
      servicesCircle.initialize();
    }
  }),
  SignupView = Backbone.Marionette.ItemView.extend({
    template: "#signup-template",
    events: {
      'click a[href=signin]': function (e) {
        e.preventDefault();
        App.MenuView.signin();
      },
      'focusin input': function (e) {
        e.preventDefault();
        this.$('.alert').hide();
      },
      'submit form': function (e) {
        e.preventDefault();
        if (this.$('input[name=email]').val() == '') {
          this.$('#emailErr').show();
          return;
        } else if (this.$('input[name=password]').val() != this.$('input[name=confPassword]').val()) {
          this.$('#matchErr').show();
          return;
        } else {
          this.$('.alert').hide();
          var options = {
              type: 'post',
              url: '/api/new-user',
              data: this.$('form').serialize(),
              success: function (data) {
                App.modal.show(new SuccessView({
                  model: new Backbone.Model(data)
                }));
                $('.navbar a[href=signup]').attr('href', 'logout').text('LOGOUT');
                App.MenuView.home();
              },
              error: function () {
                console.log(arguments);
              }
            };
          $.ajax(options);
        }
      }
    }
  }),
  SigninView = Backbone.Marionette.ItemView.extend({
    template: "#signin-template",
    events: {
      'click a[href=signup]': function (e) {
        e.preventDefault();
        App.MenuView.signup();
      },
      'submit form': function (e) {
        e.preventDefault();
        var options = {
            type: 'post',
            url: '/api/set-user',
            data: this.$('form').serialize(),
            success: function (expl, status, data) {
              if (data.status == 200) {
                $('.navbar a[href=signup]').attr('href', 'logout').text('LOGOUT');
                App.MenuView.home();
              }
            },
            error: function () {
              console.log(arguments);
            }
          };
        $.ajax(options);
      }
    }
  }),
  PricingView = Backbone.Marionette.ItemView.extend({
    template: "#pricing-template",
  }),
  ContactView = Backbone.Marionette.ItemView.extend({
    template: "#contact-template",
  }),
  BlogView = Backbone.Marionette.ItemView.extend({
    template: "#blog-template",
  }),
  ResetView = Backbone.Marionette.ItemView.extend({
    template: "#reset-template",
  }),
  NotFoundView = Backbone.Marionette.ItemView.extend({
    template: "#notFound-template",
  }),
  SuccessView = Backbone.Marionette.ItemView.extend({
    template: "#success-template",
    className: "modal-dialog"
  }),
  Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "home",
      "home": "home",
      "about": "about",
      "features": "features",
      "services": "services",
      "signup": "signup",
      "signin": "signin",
      "pricing": "pricing",
      "contact": "contact",
      "blog": "blog",
      "reset": "reset",
      '*notFound': 'notFound'
    }
  });
App.MenuView = new MenuView();
App.MenuView.checkUser();
App.content.on('show', function () {
  $('body').scrollTop(0);
})

App.on("initialize:after", function () {
  if (Backbone.history){
    Backbone.history.start({ pushState: true }); 
  }
});

App.addInitializer(function () {
  App.Router = new Router({
    controller: App.MenuView
  });
});
