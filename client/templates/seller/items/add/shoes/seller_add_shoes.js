Template.sellerAddShoes.onRendered(function(){
	$('select#input_type').change(function() {
		if(this.value === 'others'){
			$('#komo__other-type').openModal();
		}
  });
});

Template.sellerAddShoes.events({
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
