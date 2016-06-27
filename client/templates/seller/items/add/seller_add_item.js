Template.sellerAddItem.onCreated(function(){
	this.showExtraFields = new ReactiveVar('none');
});

Template.sellerAddItem.helpers({
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

Template.sellerAddItem.events({
	'change select#input_category': function(event, tmpl){
		tmpl.showExtraFields.set($(event.target).val());
		return;
	},
	
	'submit form#item-form': function(event){
		event.preventDefault();

		//collect inputs and serialize to JSON 
		var items = $('#item-form :input[id^="input"]').serializeJSON();
				
		//client side validation
		if(isNotEmpty(items.category) && isNotEmpty(items.method) && isNotEmpty(items.condition)
			&& isNotEmpty(items.numberOfTimesUsed) && isNotEmpty(items.price)){
			
			Meteor.call('/item/seller/add',items, function(err,result){
				if(err){
					Materialize.toast(err.message, 4000);
				}else{				
					Materialize.toast('Item added', 4000);
					Router.go('seller.items.pictures', {_id:result});
				}
			});
		}
		
		return;
	}
});

Template.sellerAddItem.onRendered(function(){
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

 


