homeController = RouteController.extend({
  layoutTemplate: 'layoutOneMain',

  home: function() {
    this.render('home');
    this.render('headerMenu',{to:'header'});
    this.render('homeTitle',{to:'titleNav'});
    this.render('homeSlideOut',{to:'slideOut'});
  },
  
  item: function() {
		this.render('item');
		this.render('transparentHeader',{to:'header'});
	}
});
