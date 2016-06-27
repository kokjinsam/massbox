Template.activeItems.onCreated(function(){
	var instance = this;
	
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('products', 'active', {
		onReady: function(){
			instance.subReady.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
	
});

Template.activeItems.helpers({
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
