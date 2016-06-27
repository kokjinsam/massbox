Template.home.events({
  'click #meteor-logout': function (event, tmpl) {
		Meteor.logout(function() {
			Materialize.toast('Logout was successful', 4000);
		});
		
		return false;
	},
	
	'change select#input_category': function(event, tmpl){
		tmpl.showExtraFields.set($(event.target).val());
		return;
	},
	
	'change form#filter-items': function(event, tmpl){
		//collect inputs and serialize to JSON 
		var filters = $('#filter-items').serializeJSON();
		
		Session.set('limit', 15);
		Session.set('skip', 0);
		Session.set('filters', filters);
		return;
	},
	
	'click #show-back':function(event, tmpl){
		var limit = Session.get('limit'),
				skip = Session.get('skip');
		
		if(skip > 0){
			Session.set('limit', limit-15);
			Session.set('skip', skip -15);
		}
		
		return;
	},
	
	'click #show-next':function(event, tmpl){
		var limit = Session.get('limit'),
				skip = Session.get('skip');
		
		if(limit < Counts.get('products-count')){
			Session.set('limit', limit+15);
			Session.set('skip', skip +15);
		}
		return;
	},
	
	'click #reset': function(event, tmpl){
		Session.set('limit', 15);
		Session.set('skip', 0);
		Session.set('filters', {});
		$('#filter-items')[0].reset();
		return;
	}
});

Template.home.onRendered(function(){
	$('.modal-trigger').leanModal();
});

Template.home.onCreated(function(){
	if(Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
      if (err != null) {
        if (err.message == 'Verify email link expired [403]') {
          Materialize.toast('Verification link has expired.', 4000);
        }
      } else {
        Materialize.toast('Address has been confirmed.', 4000);
        Meteor.call('/user/onboarded', function(err){
					if(err){
						Materialize.toast(err, 4000);
					}else{
						Router.go('user.onboarding', {page:1});
					}
				});
      }
    });
  }
  
	var instance = this;
	
	instance.subReady = new ReactiveVar(false);
	instance.sub2Ready = new ReactiveVar(false);
	
	instance.showExtraFields = new ReactiveVar('');
	if(Session.get('filters') != undefined){
		var query = Session.get('filters');
		if(query.category){
			instance.showExtraFields.set(query.category);
		}
	}
	
	if(Session.equals('limit', undefined) || Session.equals('skip', undefined)){
		Session.set('limit', 15);
		Session.set('skip', 0);
	}
	
	instance.autorun(function(){
		var filters = Session.get('filters'),
				limit = Session.get('limit'),
				skip = Session.get('skip');
		
		if(filters == undefined || filters == null){
			filters = {};
		}
		
		var subscription = instance.subscribe('productList', filters, skip, limit, {
			onReady: function(){
				instance.subReady.set(true);
			},
			
			onError: function(err){
				throw 'There is an error: ' + err;
			}
		});
	});
	
	var secondSubscription = instance.subscribe('filterOptions',{
		onReady: function(){
			instance.sub2Ready.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
	
	var thirdSubscription = instance.subscribe('userOnboard');
});

Template.home.helpers({
	itemsReady: function() {
		return Template.instance().subReady.get();
	},
	
	items: function(){
		if(Template.instance().subReady.get()){
			return Product.find();
		}
	},
	
	getOnePic: function(objs){
		if(objs == undefined){
			return '/background/no_pic.jpg';
		}else{
			if(objs.length <= 0){
				return '/background/no_pic.jpg';
			}else{
				return objs[0].url;
			}
		}
	},
	
	showBooks: function() {
		return Template.instance().showExtraFields.get() == 'books';
	},
	
	showElectronics: function() {
		return Template.instance().showExtraFields.get() == 'electronics';
	},
	
	showFurniture: function() {
		return Template.instance().showExtraFields.get() == 'furniture';
	},
	
	showShoes: function() {
		return Template.instance().showExtraFields.get() == 'shoes';
	},
	
	showClothing: function() {
		return Template.instance().showExtraFields.get() == 'clothing';
	},
	
	showKitchen: function() {
		return Template.instance().showExtraFields.get() == 'kitchen';
	},
	
	showVehicle: function() {
		return Template.instance().showExtraFields.get() == 'vehicle';
	},
	
	showMisc: function() {
		return Template.instance().showExtraFields.get() == 'misc';
	},
	
	categories: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.find();
		}
	},
	
	electronicsTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'electronics'});
		}
	},
	
	clothingTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'clothing'});
		}
	},
	
	furnitureTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'furniture'});
		}
	},
	
	shoesTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'shoes'});
		}
	},
	
	kitchenTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'kitchen'});
		}
	},
	
	vehicleTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'vehicle'});
		}
	},
	
	miscTypes: function() {
		if(Template.instance().sub2Ready.get()){
			return filterOptions.findOne({_id:'misc'});
		}
	},
	
	hideBack: function() {
		if(Session.get('skip') <= 0){
			return 'komo-hide';
		}
	},
	
	hideNext: function() {
		if(Session.get('limit') >= Counts.get('products-count')){
			return 'komo-hide'
		}
	},
	
	hideRequestCount: function() {
		return Counts.get('request-buyer-count') == 0 ? 'komo-hide':'';
	},
	
	hideMessageCount: function() {
		return Counts.get('message-buyer-count') == 0 ? 'komo-hide':'';
	},
	
	isSelectedCategory: function(){
		if(Session.get('filters') != '' || Session.get(filters) != undefined){
			var query = Session.get('filters');
			if(query && query['category']){
				return this._id == query['category'] ? 'selected':'';
			}
		}
		
		return '';
	},
	
	isSelectedValue: function(value){
		if(Session.get('filters') != '' || Session.get(filters) != undefined){
			var query = Session.get('filters');
			if(query && query[value]){
				return this.value == query[value] ? 'selected':'';
			}
		}
		
		return '';
	},
	
	isSelected: function(value){
		if(Session.get('filters') != '' || Session.get(filters) != undefined){
			var query = Session.get('filters');
			if(query && query[value]){
				return this == query[value] ? 'selected':'';
			}
		}
		
		return '';
	},
	
	method: function() {
		return [{
			value:'pick up',
			text:'Pick up'
		},{
			value:'meet up',
			text:'Meet up'
		},{
			value:'drop off',
			text: 'Drop off'
		}];
	},
	
	size: function() {
		return [{
			value:'xs',
			text:'XS'
		},{
			value:'s',
			text:'S'
		},{
			value:'m',
			text: 'M'
		},{
			value:'l',
			text:'L'
		},{
			value:'xl',
			text:'XL'
		}];
	},
	
	sex: function() {
		return [{
			value:'male',
			text:'Male'
		},{
			value:'female',
			text:'Female'
		},{
			value:'unisex',
			text: 'Unisex'
		}];
	},
	
	speed: function(){
		return [{
			value:'single',
			text:'Single Speed'
		},{
			value:'6',
			text:'6 Speed'
		},{
			value:'9',
			text:'9 Speed'
		},{
			value:'12',
			text:'12 Speed'
		},{
			value:'24',
			text:'24 Speed'
		},{
			value:'32',
			text:'32 Speed'
		}]
	}
});

