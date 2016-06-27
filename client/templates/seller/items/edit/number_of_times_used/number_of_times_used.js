Template.numberOfTimesUsedOption.helpers({
	numberOfTimesUsed: function() {
		return [{
			value:'less than 5',
			text:'Less than 5'
		},{
			value:'less than 15',
			text:'Less than 15'
		},{
			value:'less than 45',
			text:'Less than 45'		
		},{
			value:'more than 100',
			text:'More than 100'
		},{
			value:'uncountable',
			text:'Uncountable'
		}];
	},
	
	selected: function(value, numberOfTimesUsed) {
		return value == numberOfTimesUsed ? 'selected': '';
	}
});
