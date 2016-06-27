Template.sellerEditClothing.onRendered(function(){
	$('select#input_type').change(function() {
		if(this.value === 'others'){
			$('#komo__other-type').openModal();
		}
  });
});

Template.sellerEditClothing.events({
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

Template.sellerEditClothing.helpers({
	type: function() {
		var route = Router.current(),
				docId = route.params._id;
				
		var typeObj =  Product.findOne({_id:docId},{type:1}),
				result = false,
				typeArray = [{
					value:'dress',
					text:'Dress'
				},{
					value:'jacket',
					text:'Jacket'
				},{
					value:'pants',
					text: 'Pants'
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
	
	selectedType: function(value, type){
		return value == type ? 'selected': ''; 
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
	
	selectedSize: function(value, size){
		return value == size ? 'selected':'';
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
	
	selectedSex: function(value, sex){
		return value == sex ? 'selected':'';
	}
});
