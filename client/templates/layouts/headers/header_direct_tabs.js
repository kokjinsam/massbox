Template.headerDirectTabs.helpers({
	title: function () {
		return Session.get('title');
	},
	
	setColor: function() {
		var routeName = Router.current().route.getName();
		
		if(routeName == 'seller.dashboard' || routeName == 'seller.requests' ||
			routeName == 'seller.requests.edit' || routeName == 'seller.items' ||
			routeName == 'seller.items.add' || routeName == 'seller.items.edit') {
		
			return 'komo-nav-brown';
		}else{
			if(Session.get('mode') == 'seller'){
				return 'komo-nav-brown';
			}else{
				return 'komo-nav-blue';
			}
		}
	},
	
	formatURL: function() {
		var route = Router.current().route.getName(),
				mode = Session.get('mode');
		
		/*
		 * Buyer routes
		 */
		if(route == 'messages' || route == 'settings' || route == 'requests'){
			return '/';
		}
		
		if(route == 'settings.profile.edit' || route == 'settings.account.changePassword'){
			return '/settings'
		}
		
		if(route == 'messages.view' && mode == 'buyer') {
			return '/messages';
		}
		
		if(route == 'requests.view' && mode == 'buyer') {
			return '/requests';
		}
		
		/*
		 * Seller routes
		 */
		if(route == 'seller.requests' || route == 'seller.messages' || route == 'seller.items'){
			return '/seller/dashboard';
		}
		
		if(route == 'messages.view' && mode == 'seller') {
			return '/seller/messages';
		}
		
		if(route == 'requests.view' && mode == 'seller') {
			return '/seller/requests';
		}
		
		if(route == 'seller.items.edit' || route == 'seller.items.pictures' || route == 'seller.items.add'){
			return '/seller/items';
		}
		
	}
});

Template.requestsTabs.helpers({
	currentRequests: function() {
		if(Session.get('currentRequests') == 0){
			return '';
		}else{
			return '('+Session.get('currentRequests')+')';
		}
	},
	
	pendingRequests: function() {
		if(Session.get('pendingRequests') == 0){
			return '';
		}else{
			return '('+Session.get('pendingRequests')+')';
		}
	}
});


