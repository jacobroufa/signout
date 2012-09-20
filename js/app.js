var ENTER_KEY = 13;

App = (function($) {

  // page wrapper models
  var Page = Backbone.Model.extend({
    initialize: function() {
      console.log('initializing page model');
    }
  });

  var homePage = new Page({ title: 'Equipment Signout', type: 'home' });
  var logPage = new Page({ title: 'Log for ', type: 'log' });
  var assetPage = new Page({ title: 'Assets Management', type: 'asset' });

  // asset model
  var Asset = Backbone.Model.extend({
    urlRoot: 'api/assets',
    defaults: {
      id: "",
      tag: "",
      desc: "",
      state: ""
    },
    initialize: function() {
      console.log('initializing asset model');
    },
  });

  // log model
  var Log = Backbone.Model.extend({});

  // collections
  
  var Assets = Backbone.Collection.extend({
    url: 'api/assets',
    model: Asset,
    initialize: function() {
      console.log('initializing assets collection');
      this.deferred = this.fetch();
    },
  });

  // wrap views and router in doc.ready
  $(document).ready(function () {

    // page wrapper views
    var PageView = Backbone.View.extend({
      el: '#container',
      template: _.template($('#page-template').html()),

      initialize: function() {
        console.log('initializing page view');
        this.model.on('change', this.render, this);
      },

      render: function() {
        console.log('rendering page view');
        $(this.el).html(
          this.template(this.model.toJSON())
        );
      }
    });

    var homeView = new PageView({ model: homePage });
    var logView = new PageView({ model: logPage });
    var assetView = new PageView({ model: assetPage });

    // individual asset view
    var AssetsView = Backbone.View.extend({
      el: '.home-list',
      tagName: 'li',
      template: _.template($('#asset-template').html()),

      initialize: function() {
        console.log('initializing assets view list');
        this.collection.on('change', this.render, this);
      },

      render: function() {
        var self = this;
        console.log('rendering assets view list');
        console.log(self.collection);

        this.collection.deferred.done(function() {
          self.collection.each(function(asset){
            console.log("assets");
            $(this.el).html(
              self.template(asset.toJSON())
            );
          }, this);
        });
        return this;
      },
    });

    var assets = new Assets();
    
    var assetsView = new AssetsView({
      collection: assets,
    });

    // build router here
    NewsroomSignout = Backbone.Router.extend({
      routes: {
        '': 'home',
        'log/:lid': 'log',
        'assets': 'assets'
      },

      initialize: function() {
        // build init function
        console.log('initializing router');
      },

      home: function() {
        // print the wrapper
        $('#container').empty();
        $('#container').html(homeView.render());
        // print the asset list
        $('.home-list').html(assetsView.render().el);
      },

      log: function(lid) {
        // build log page
        $('#container').empty();
        $('#container').html(logView.render().el);
      },

      assets: function() {
        // build assets page
        $('#container').empty();
        $('#container').html(assetView.render().el);
      },

    });

    var pageRouter = new NewsroomSignout();

    Backbone.history.start();

  });

})(jQuery);
