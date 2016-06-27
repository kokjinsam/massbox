Template.sellerEditElectronics.onRendered(function(){
	$('select#input_type').change(function() {
		if(this.value === 'others'){
			$('#komo__other-type').openModal();
		}
  });
});

Template.sellerEditElectronics.helpers({
	type: function() {
		var route = Router.current(),
				docId = route.params._id;
				
		var typeObj =  Product.findOne({_id:docId},{type:1}),
				result = false;
				typeArray = [{
					value:'laptop',
					text:'Laptop'
				},{
					value:'monitor',
					text:'Monitor'
				},{
					value:'speaker',
					text:'Speaker'
				},{
					value:'tablet',
					text:'Tablet'
				},{
					value:'phone',
					text:'Phone'
				},{
					value:'others',
					text:'Others'
				}];
		
		if(typeObj && typeObj.type){
			result = findDuplicate(typeArray, typeObj.type);
		}
		
		if(!result){
			if(typeObj.type != undefined){
				type = {
					value:typeObj.type,
					text:typeObj.type
				}
				
				typeArray.splice(-1,0,type);
			}
		}
		
		return typeArray;
	},
	
	selected: function(value, type){
		return value == type ? 'selected': ''; 
	}
});

Template.sellerEditElectronics.events({
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
