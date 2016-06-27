Router.configure({
	
});

Router.route('/', {
  name: 'home',
  controller: 'homeController',
  onBeforeAction: function() {
		Session.set('mode','buyer');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
  action: 'home',
  where: 'client'
});

Router.route('/requests', {
  name: 'requests',
  controller: 'eventController',
  onBeforeAction: function() {
		Session.set('mode','buyer');
		Session.set('title','Requests');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
  action: 'listRequests',
  where: 'client'
});

Router.route('/requests/:_id',{
	name: 'requests.view',
	controller: 'eventController',
	onBeforeAction: function() {
		Session.set('mode','buyer');
		Session.set('title','Request');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'viewRequest',
	where: 'client'
});

Router.route('/requests/:_id/schedule',{
	name: 'requests.schedule',
	controller: 'eventController',
	layoutTemplate: 'layoutFull',
	onBeforeAction: function() {
		Session.set('mode','buyer');		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'addRequest',
	where: 'client'
});

Router.route('/profile/:_id',{
	name: 'profile',
	controller: 'userController',
	layoutTemplate: 'layoutFull',
	onBeforeAction: function() {
		Session.set('mode','buyer');		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'profile',
	where: 'client'
});

Router.route('/settings',{
	name: 'settings',
	controller: 'settingsController',
	onBeforeAction: function() {
		Session.set('mode','buyer');
		Session.set('title','Settings');
		
		SEO.set({
        title: 'MassBox -Settings',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'main',
	where: 'client'
});

Router.route('/settings/profile/edit',{
	name: 'settings.profile.edit',
	controller: 'settingsController',
	onBeforeAction: function() {
		Session.set('mode','buyer');
		Session.set('title','Edit Profile');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'editProfile',
	where: 'client'
});

Router.route('/settings/account/change-password',{
	name: 'settings.account.changePassword',
	controller: 'settingsController',
	onBeforeAction: function() {
		Session.set('title','Update Password');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'changePassword',
	where: 'client'
});

Router.route('/sign-up',{
	name: 'user.signUp',
	controller: 'userController',
	onBeforeAction: function() {		
		SEO.set({
        title: 'MassBox - Sign Up',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'signUp',
	where: 'client'
});

Router.route('/onboarding',{
	name: 'user.onboarding.dummy',
	onBeforeAction: function(){
		Router.go('user.onboarding', {page:1});
		this.next();
	}
});

Router.route('/onboarding/:page',{
	name: 'user.onboarding',
	controller: 'userController',
	onBeforeAction: function() {
		var route = Router.current();
				page = route.params.page,
				navBarColor = '#3F51B5';
				
		if(page == 1){
			navBarColor = '#AFB42B';
		}
		
		if(page == 2){
			navBarColor = '#536DFE';
		}
		
		if(page == 3){
			navBarColor = '#689F38';
		}
		
		if(page == 4){
			navBarColor = '#FF9800';
		}
		
		SEO.set({
        title: 'MassBox - onboarding',
        meta: {
          'theme-color': navBarColor
        }
    });
    
		this.next();
	},
	action: 'onboarding',
	where: 'client'
});

Router.route('/sign-in',{
	name: 'user.signIn',
	controller: 'userController',
	onBeforeAction: function() {		
		SEO.set({
        title: 'MassBox - Sign In',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'signIn',
	where: 'client'
});

Router.route('/items/:_id',{
	name: 'item',
	controller: 'homeController',
	onBeforeAction: function() {
		Session.set('mode','buyer');
		Session.set('title','');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'item',
	where: 'client'
});

//not done
Router.route('/forgot-password',{
	name: 'user.forgotPassword',
	controller: 'userController',
	onBeforeAction: function() {
		Session.set('title','Name');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'forgotPassword',
	where: 'client'
});

Router.route('/about',{
	name: 'about',
	layoutTemplate:'layoutFull',
	controller: 'eventController',
	onBeforeAction: function() {		
		SEO.set({
        title: 'Massbox - About',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'about',
	where: 'client'
});

Router.route('/faq',{
	name: 'faq',
	controller: 'eventController',
	onBeforeAction: function() {
		Session.set('title','FAQ');		
		SEO.set({
        title: 'Massbox - FAQ',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'faq',
	where: 'client'
});

Router.route('/messages',{
	name: 'messages',
	controller: 'eventController',
	onBeforeAction: function() {
		Session.set('mode','buyer');
		Session.set('title','Messages from Seller');
		
		SEO.set({
        title: 'MassBox - Messages from Seller',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'listMessages',
	where: 'client'
});

/*
 * Shared routes for buyers and sellers
 * 
 * 
 */

Router.route('/requests/:_id/edit',{
	name: 'requests.edit',
	controller: 'eventController',
	onBeforeAction: function() {
		Session.set('title','Edit Request');
		
		SEO.set({
        title: 'MassBox',
        meta: {
          'theme-color': '#3F51B5'
        }
    });
    
		this.next();
	},
	action: 'editRequest',
	where: 'client'
});

Router.route('/messages/:_id',{
	name: 'messages.view',
	controller: 'eventController',
	onBeforeAction: function() {
		var mode = Session.get('mode'),
				navBarColor = '#3F51B5';
				
		if(mode == 'buyer'){
			navBarColor = '#3F51B5';
		}
		
		if(mode == 'seller'){
			navBarColor = '#795548';
		}
		
			
		SEO.set({
        title: 'MassBox - Message',
        meta: {
          'theme-color': navBarColor
        }
    });
    
		this.next();
	},
	action: 'viewMessage',
	where: 'client'
});

/* 
 * Seller Routes Only
 *
 * 
 */

Router.route('/seller/sign-up',{
	layoutTemplate:'layoutFull',
	name: 'seller.signUp',
	controller: 'sellerController',
	onBeforeAction: function() {		
		SEO.set({
        title: 'Sign Up for Seller Account',
        meta: {
          'theme-color': '#795548'
        }
    });
    
    this.next();
	},
	action: 'signUp',
	where: 'client'
});

Router.route('/seller/dashboard',{
	name: 'seller.dashboard',
	controller: 'sellerController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		
		SEO.set({
        title: 'Dashboard',
        meta: {
          'theme-color': '#795548'
        }
    });
    
    this.next();
	},
	action: 'dashboard',
	where: 'client'
});

Router.route('/seller/requests',{
	name: 'seller.requests',
	controller: 'sellerController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','Your Requests');
		
		SEO.set({
        title: 'Requests',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'requests',
	where: 'client'
});

Router.route('/seller/requests/:_id',{
	name: 'seller.requests.view',
	controller: 'eventController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','Request');
		
		SEO.set({
        title: 'Request',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'viewRequest',
	where: 'client'
});

Router.route('/seller/items',{
	name: 'seller.items',
	controller: 'sellerController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','Your Items');
		
		SEO.set({
        title: 'Items',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'items',
	where: 'client'
});

Router.route('/seller/items/add',{
	name: 'seller.items.add',
	controller: 'sellerController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','New Item');
		
		SEO.set({
        title: 'Add New Item',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'addItems',
	where: 'client'
});

Router.route('/seller/items/:_id/pictures',{
	name: 'seller.items.pictures',
	controller: 'sellerController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','Item Pictures');
		
		SEO.set({
        title: 'Item Pictures',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'addPictures',
	where: 'client'
});

Router.route('/seller/items/:_id/edit',{
	name: 'seller.items.edit',
	controller: 'sellerController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','Edit Item');
		
		SEO.set({
        title: 'Edit Item',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'editItems',
	where: 'client'
});

Router.route('/seller/messages',{
	name: 'seller.messages',
	controller: 'eventController',
	onBeforeAction: function() {
		Session.set('mode','seller');
		Session.set('title','Messages from Buyer');
		
		SEO.set({
        title: 'MassBox - Messages from Buyer',
        meta: {
          'theme-color': '#795548'
        }
    });
    
		this.next();
	},
	action: 'listMessages',
	where: 'client'
});

/* 
 * Before Hooks
 * 
 * 
 * 
 * 
 * 
 */

var IRHooks = {
	requireSeller: function() {
		if(!Roles.userIsInRole(Meteor.user(),['seller'])){
			this.redirect('seller.signUp');
		}else{
			this.next();
		}
	},
	
	isSeller: function() {
		if(Roles.userIsInRole(Meteor.user(),['seller'])){
			this.redirect('seller.dashboard');
		}else{
			this.next();
		}
	},
	
	requireLogin: function() {
		if (!Meteor.user()) {
			if (Meteor.loggingIn()) {
				console.log('loading');
			} else {
				this.redirect('user.signIn');
			}
		} else {
			this.next();
		}
	},
	
	isLoggedIn: function() {
		if(Meteor.user()){
			this.redirect('home');
		}else{
			this.next();
		}
	}
}

Router.onBeforeAction(IRHooks.requireLogin, {
	except:['home','user.signIn','user.signUp', 'about', 'faq','item']
});

Router.onBeforeAction(IRHooks.isLoggedIn, {
	only:['user.signIn','user.signUp']
});

Router.onBeforeAction(IRHooks.isSeller, {
	only:['seller.signUp']
});

Router.onBeforeAction(IRHooks.requireSeller, {
	only:['seller.dashboard','seller.requests','seller.requests.edit',
	'seller.requests.view','seller.today','seller.items','seller.items.add']
});

