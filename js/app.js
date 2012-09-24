var ENTER_KEY = 13;

App = (function($) {

  // page wrapper models
  var Page = Backbone.Model.extend({
    initialize: function() {
      console.log('initializing page model');
    }
  });

  var homePage = new Page({
    title: 'Equipment Signout',
    type: 'home',
    page: 'To sign out some equipment, just sign your name and click "Sign Out". If you are returning an item, click "Return It!" If the item is unavailable, you won\'t be able to sign your name. To view the log for any asset, click the log button next to the item\'s name.'
  });
  var logPage = new Page({});
  var assetPage = new Page({
    title: 'Assets Management',
    type: 'asset',
    page: 'Add an asset here, or edit existing assets.'
  });

  // asset model
  var Asset = Backbone.Model.extend({
    urlRoot: 'api/assets',
    defaults: {
      id: "",
      tag: "",
      description: "",
      state: ""
    },
    initialize: function() {
      console.log('initializing asset model');
    },
    sign: function() {
      this.save({
        state: !this.get('state')
      });
    },
  });

  // log model
  var Log = Backbone.Model.extend({
    urlRoot: 'api/logs',
    defaults: {
      id: "",
      aid: "",
      user: "",
      signin: "",
      signout: "",
    },
  });

  // collections
  
  var Assets = Backbone.Collection.extend({
    url: 'api/assets',
    model: Asset,
    initialize: function() {
      console.log('initializing assets collection');
      this.deferred = this.fetch();
    },
  });

  var Logs = Backbone.Collection.extend({
    url: 'api/logs',
    model: Log,
    initialize: function() {
      this.deferred = this.fetch();
    },
  });

  // wrap views and router in doc.ready
  $(document).ready(function () {

    // page wrapper views
    var PageView = Backbone.View.extend({
      el: 'body',
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

    var homePageView = new PageView({ model: homePage });
    var singlePageView = new PageView({ model: logPage });
    var assetPageView = new PageView({ model: assetPage });

    // individual asset view
    var AssetsView = Backbone.View.extend({
      tagName: 'ul',
      className: 'unstyled',
      homeTemplate: _.template($('#asset-template').html()),

      initialize: function() {
        console.log('initializing assets view list');
        this.collection.on('change', this.render, this);
      },

      homeRender: function() {
        var self = this;
        console.log('rendering assets view list');

        this.collection.deferred.done(function() {
          self.$el.empty();
          self.collection.each(function(asset){
            self.$el.append(
              self.homeTemplate(asset.toJSON())
            );

            var aid = asset.get('id');
            var astate = asset.get('state');
            console.log(aid + ' ' + astate);
            // $('.asset-signer').html(signerView.render(aid, astate).el);
          }, self);
        });
        return this;
      },
    });

    var assets = new Assets();
    
    var assetsView = new AssetsView({
      collection: assets,
    });

    // sign in-out view
    var SignerView = Backbone.View.extend({
      tagName: 'div',
      className: 'input-append',
      template: _.template($('#signer-template').html()),

      // remember to return '.uneditable-input' when state is signed-out
      render: function(aid, astate) {
        var self = this;
        console.log('rendering signer view');

        this.collection.deferred.done(function() {
          self.$el.empty();
          // if aid == model.get(aid)
        });
      },
    });

    var logs = new Logs();
    var signerView = new SignerView({
      collection: logs,
    });

    // build router here
    NewsroomSignout = Backbone.Router.extend({
      routes: {
        '': 'home',
        'asset/:id': 'asset',
        'assets': 'assets'
      },

      initialize: function() {
        // build init function
        console.log('initializing router');
      },

      home: function() {
        // print the wrapper
        $('body').empty();
        $('body').html(homePageView.render());
        // print the asset list
        $('#home-list').html(assetsView.homeRender().el);
      },

      asset: function(id) {
        // build log page
        $('#container').empty();
        $('#container').html(singlePageView.render().el);
      },

      assets: function() {
        // build assets page
        $('#container').empty();
        $('#container').html(assetPageView.render().el);
      },

    });

    var pageRouter = new NewsroomSignout();

    Backbone.history.start();

  });

})(jQuery);
