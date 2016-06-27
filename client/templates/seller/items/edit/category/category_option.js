Template.categoryOption.helpers({
	category: function() {
		return [{
			value:'books',
			text:'Books'
		},{
			value:'electronics',
			text:'Electronics'
		},{
			value:'furniture',
			text: 'Furniture'
		},{
			value:'clothing',
			text:'Clothing'
		},{
			value:'shoes',
			text:'Shoes'
		},{
			value:'kitchen',
			text:'Kitchenware'
		},{
			value:'vehicle',
			text:'Vehicle'
		},{
			value:'misc',
			text:'Miscellaneous'
		}];
	},
	
	selected: function(value, category) {
		return value == category ? 'selected': '';
	}
});
