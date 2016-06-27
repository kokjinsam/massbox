sellerController = RouteController.extend({
  layoutTemplate: 'layoutOneMain',

  subscriptions: function() {
  },
	
	signUp: function() {
		this.render('sellerSignUp');
	},
	
  dashboard: function() {
    this.render('sellerDashboard');
    this.render('headerMenu',{to:'header'});
    this.render('dashboardTitle',{to:'titleNav'});
    this.render('dashboardSlideOut',{to:'slideOut'});
  },
  
  requests: function() {
    this.render('sellerRequests');
    this.render('requestsTabs',{to:'tabs'});
    this.render('headerDirectTabs',{to:'header'});
	},
	
	editRequest: function() {
    this.render('sellerRequests');
    this.render('requestsTabs',{to:'tabs'});
    this.render('headerDirectTabs',{to:'header'});
	},
	
	items: function() {
		this.render('sellerItems');
		this.render('headerDirect',{to:'header'});
	},
	
	addItems: function() {
		this.render('sellerAddItem');
		this.render('headerDirect',{to:'header'});
	},
	
	addPictures: function() {
		this.render('sellerAddPictures');
		this.render('headerDirect',{to:'header'});
	},
	
	editItems: function() {
		this.render('sellerEditItem',{data:{ 
			product: Product.findOne({_id:this.params._id})
		}});
		this.render('headerDirect',{to:'header'});
	}
});
