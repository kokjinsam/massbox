Template.sellerEditKitchen.onRendered(function(){
	$('select#input_type').change(function() {
		if(this.value === 'others'){
			$('#komo__other-type').openModal();
		}
  });
});

Template.sellerEditKitchen.events({
	'click #komo__other-type-add': function(event,tmpl){
		event.preventDefault();
		
		var newVal = tmpl.find('#input_other').value;
		
		if(newVal !== ''){
			$('select#input_type').append('<option value="'
				+ newVal
				+ '" selected="selected">'
				+ newVal
				+ '</option>');
		}else{
			return false;
		}
	}
});

Template.sellerEditKitchen.helpers({
	type: function() {
		return [{
			value:'plate',
			text:'Plate'
		},{
			value:'bowl',
			text:'Bowl'
		},{
			value:'fork',
			text: 'Fork'
		},,{
			value:'spoon',
			text: 'Spoon'
		},{
			value:'others',
			text:'Others'
		}];
	},
	
	selectedType: function(value, type){
		return value == type ? 'selected': ''; 
	}
});
