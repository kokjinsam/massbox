Template.item.onCreated(function(){
	var instance = this;
	var route = Router.current();
	var docId = route.params._id;

	//reactive var to determine product database subscription is ready
	instance.productReady = new ReactiveVar(false);
	
	//reactive var for showExtrafields
	instance.showExtraFields = new ReactiveVar('');
	
	var subscription = instance.subscribe('product', docId, {
		onReady: function(){
			instance.productReady.set(true);
			
			var categoryObj =  Product.direct.findOne({_id:docId},{category:1});
			if(categoryObj && categoryObj.category){
				instance.showExtraFields.set(categoryObj['category']);
			}
			
			var query = Product.direct.findOne({_id:docId}),
					picArray = [];
			
			if(query.pictures){
				pictures = query.pictures;
			}else{
				pictures = [];
			}
			
			for(var i = 0; i < pictures.length; i++){
				var picObj = {
					src: pictures[i].url,
					w: pictures[i].width,
					h: pictures[i].height
				}	
				picArray.push(picObj);
			}
			openPhotoSwipe = function() {
			var pswpElement = document.querySelectorAll('.pswp')[0];
				// define options (if needed)
				var options = {       
						history: false,
						focus: false,
			
						showAnimationDuration: 0,
						hideAnimationDuration: 0
				};
				
				var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, picArray, options);
				gallery.init();
			};
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.item.events({
	'click #gallery': function (event, tmpl) {
		openPhotoSwipe();
	},
	
	'click #request-button':function(event, tmpl){
		event.preventDefault();
		
		var route = Router.current();
		var itemId = route.params._id;
		
		Meteor.call('/request/buyer/add', itemId, function(err,result){
			if(err){
				Materialize.toast(err.reason, 4000);
			}else{
				if(result.message == 'created-request'){
					Materialize.toast('Please complete the request', 4000);
					Router.go('requests.schedule', {_id:result.requestId});
				}else if(result.message == 'updated-request'){
					Materialize.toast('Updated request', 4000);
					Router.go('home');
				}
			}	
		});
	}
});

Template.item.helpers({
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
	
	item: function() {
		if(Template.instance().productReady.get()){
			var instance = this;
			var route = Router.current();
			var docId = route.params._id;
			
			return Product.direct.findOne({_id:docId});
		}
	},
	
	isOwner: function() {
		return Meteor.userId() == this.owner;
	},
	
	seller: function() {
		return Meteor.users.findOne({_id:this.owner});
	},
	
	isEmpty: function(value) {
		return value == '' || value == undefined ? 'komo-hide':'';
	},
	
	iconMethod: function(method){
		if(method == 'meet up'){
			return 'local_cafe';
		}
		
		if(method == 'drop off'){
			return 'local_shipping';
		}
		
		if(method == 'pick up'){
			return 'directions_run';
		}
	},
	
	formatDate: function(date){
		return moment(date).format('MMM Do');
	},
	
	notAvailable: function(){
		if(Template.instance().productReady.get()){
			var instance = this,
					route = Router.current(),
					docId = route.params._id,
					query = Product.direct.findOne({_id:docId});
					
			if(query.status !== 'active'){
				return true
			}
			
			return false;
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
	}
});
