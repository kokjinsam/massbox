Template.sellerEditItem.onCreated(function(){
	var instance = this;
	var route = Router.current();
	var docId = route.params._id;
	
	//reactive var for showExtrafields
	instance.showExtraFields = new ReactiveVar('');
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('productDetail', docId, {
		onReady: function() {
			var categoryObj =  Product.findOne({_id:docId},{category:1});
			if(categoryObj && categoryObj.category){
				instance.showExtraFields.set(categoryObj['category']);
			}
			instance.subReady.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.sellerEditItem.helpers({
	isEmptySub: function(){
		if(Template.instance().subReady.get()){
			return Product.find().count() == 0;
		}
	},
	
	editNotAllowed: function() {
		if(Template.instance().subReady.get()){
			var route = Router.current(),
					docId = route.params._id,
					status = Product.findOne({_id:docId}).status;
			
			return status == 'requested' || status == 'sold' || status == 'removed' ? true:false;
		}
	},
	
	hideNotAllowed: function() {
		if(Template.instance().subReady.get()){
			var route = Router.current(),
					docId = route.params._id,
					status = Product.findOne({_id:docId}).status;
			
			return status == 'requested' || status == 'sold' || status == 'removed' ? 'komo-hide':'';
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
	}
});

Template.sellerEditItem.events({
	'submit form#edit-item-form': function(event, tmpl){
		event.preventDefault();
		
		//collect inputs and serialize to JSON 
		var items = $('#edit-item-form :input').serializeJSON();
		
		//client side validation <--not done--->
		
		var route = Router.current(),
				docId = route.params._id;
		
		Meteor.call('/items/seller/edit', docId, items, function(err,result){
			if(err){
				Materialize.toast(err.message, 4000);
			}else{
				if(result){
					if(result.message == 'no-update'){
						Materialize.toast('Item was not updated', 4000);
						Router.go('seller.items');
					}
					
					if(result.message == 'updated-item'){
						Materialize.toast('Update was successful', 4000);
						Router.go('seller.items');
					}
				}
			}
			
			return;
		});
	},
	
	'change select#input_category': function(event, tmpl){
		tmpl.showExtraFields.set($(event.target).val());
		return;
	},
	
	'click #delete-item': function(event, tmpl){
		event.preventDefault();
		
		var route = Router.current(),
				docId = route.params._id;
				
		Meteor.call('/items/seller/delete', docId, function(err, result){
			if(err){
				$('#modal1').closeModal();
				Materialize.toast(err, 4000);
				return;
			}else{
				$('#modal1').closeModal();
				Materialize.toast('Item was deleted', 4000);
				Router.go('seller.items');
				return;
			}
		});
	}
});

Template.sellerEditItem.onRendered(function(){
	$('.modal-trigger').leanModal();
	$('textarea#input_notes').characterCounter();
	$('select').material_select();
		
	var max120 = 120;
	$('textarea#input_notes').keypress(function(event){
		if (event.which < 0x20) {
			return;
		}
		
		if (this.value.length == max120) {
			event.preventDefault();
		} else if (this.value.length > max120) {
			this.value = this.value.substring(0,max120);
		}
	});
});
