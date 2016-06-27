Template.sellerItems.onCreated(function(){
	var instance = this;
	instance.page = new ReactiveVar('active');
	
});

Template.sellerItems.helpers({
	isActive: function(){
		return Template.instance().page.get() == 'active';
	},
	
	isUnlisted: function(){
		return Template.instance().page.get() == 'unlisted';
	},
	
	isRequested: function(){
		return Template.instance().page.get() == 'requested';
	},
	
	isSold: function(){
		return Template.instance().page.get() == 'sold';
	},
	
	getPage:function() {
		return Template.instance().page.get();
	}
});

Template.sellerItems.onRendered(function(){	
	$('.dropdown-button').dropdown({
		inDuration: 300,
		outDuration: 225,
		constrain_width: true, 
		hover: false,
		gutter: 0, 
		belowOrigin: false 
  });
});

Template.sellerItems.events({
	'click #active-items': function() {
		Template.instance().page.set('active');
		return;
	},
	
	'click #unlisted-items': function() {
		Template.instance().page.set('unlisted');
		return;
	},
	
	'click #requested-items': function() {
		Template.instance().page.set('requested');
		return;
	},
	
	'click #sold-items': function() {
		Template.instance().page.set('sold');
		return;
	},
});
