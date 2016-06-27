Template.methodOption.helpers({
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
	
	selected: function(value, method) {
		return value == method ? 'selected': '';
	}
});
