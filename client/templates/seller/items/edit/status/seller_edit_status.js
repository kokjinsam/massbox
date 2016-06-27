Template.statusOption.helpers({
	status: function() {
		return [{
			value:'active',
			text:'Active'
		},{
			value:'unlisted',
			text:'Unlisted'
		}];
	},
	
	selected: function(value, status) {
		return value == status ? 'selected': '';
	}
});
