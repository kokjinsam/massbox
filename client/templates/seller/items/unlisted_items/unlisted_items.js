Template.unlistedItems.onCreated(function(){
	var instance = this;
	
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('products', 'unlisted', {
		onReady: function(){
			instance.subReady.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
	
});

Template.unlistedItems.helpers({
	products: function(){
		if(Template.instance().subReady.get()){
			return Product.find();
		}
	},
	
	noProducts: function() {
		if(Template.instance().subReady.get()){
			return Product.find().count() == 0;
		}
	}
});
