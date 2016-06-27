Template.request.onCreated(function(){
	var instance = this;
	var route = Router.current();
	var requestId = route.params._id;
	
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('request', requestId, {
		onReady: function(){
			instance.subReady.set(true);
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.request.helpers({
	isEmptySub: function(){
		if(Template.instance().subReady.get()){
			var route = Router.current();
			var requestId = route.params._id;
			return Request.find({_id: requestId}).count() == 0;
		}
	},
	
	hideEdit: function(){
		var route = Router.current(),
				requestId = route.params._id,
				request = Request.findOne({_id: requestId});
	
		return (request.status == 'canceled' || request.status == 'declined' || request.status == 'incomplete' || request.delivered == true) ? 'komo-hide':'';
	},
	
	showEdit: function(){
		var route = Router.current(),
				requestId = route.params._id,
				request = Request.findOne({_id: requestId});
	
		return request.status == 'incomplete' ? '':'komo-hide';
	},
	
	request:function(){
		if(Template.instance().subReady.get()){
			var route = Router.current();
			var requestId = route.params._id;
			return Request.findOne({_id: requestId});
		}
	},
	
	products: function(){
		if(Template.instance().subReady.get()){
			var route = Router.current();
			var requestId = route.params._id;
			request = Request.findOne({_id: requestId});
			
			return Product.find({_id:{$in:request.items}},{price:1})
		}
	},
	
	total: function(){
		if(Template.instance().subReady.get()){
			var route = Router.current();
			var requestId = route.params._id;
			request = Request.findOne({_id: requestId}),
			prices = [],
			products = Product.find({_id:{$in:request.items}},{price:1}).forEach(function(doc){
				prices.push(doc.price);
			}),
			total = _.reduce(prices, function(sum, elem){
				return sum+elem;
			});
			
			return total;
		}
	}
});
