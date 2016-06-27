Template.sellerEditVehicle.onRendered(function(){
	$('select#input_type').change(function() {
		if(this.value === 'others'){
			$('#komo__other-type').openModal();
		}
  });
});

Template.sellerEditVehicle.helpers({
	type: function() {
		var route = Router.current(),
				docId = route.params._id;
				
		var typeObj =  Product.findOne({_id:docId},{type:1}),
				result = false;
				typeArray = [{
					value:'sedan',
					text:'Sedan'
				},{
					value:'sports car',
					text:'Sports'
				},{
					value:'mpv',
					text:'MPV'
				},{
					value:'truck',
					text:'Truck'
				},{
					value:'bike',
					text:'Bike'
				},{
					value:'scooter',
					text:'Scooter'
				},{
					value:'motorbike',
					text:'Motorbike'
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

Template.sellerEditVehicle.events({
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
