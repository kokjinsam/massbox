Template.sellerRequests.onRendered(function(){
	$('ul.tabs').tabs();
});

Template.sellerRequests.onCreated(function(){
	var instance = this;
	var subscription = instance.subscribe('sellerRequests', {
		onReady: function(){
			instance.autorun(function(){
				var currentQuery = Request.find({$or:[{status:'accepted'},{status:'incomplete'}], delivered:false}),
						currentCount = currentQuery.count();
		
				Session.set('currentRequests', currentCount);
			});
			
			instance.autorun(function(){
				var pendingQuery = Request.find({status:'pending', delivered:false}),
						pendingCount = pendingQuery.count();
				
				Session.set('pendingRequests', pendingCount);
			});
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.sellerRequests.helpers({
	noCurrentRequests: function() {
		return Request.find({$or:[{status:'accepted'},{status:'incomplete'}], delivered:false}).count() == 0;
	},
	
	noPendingRequests: function() {
		return Request.find({status:'pending', delivered:false}).count() == 0;
	},
	
	noPastRequests: function() {
		return Request.find({$or:[{delivered:true},{status:'declined'},{status:'canceled'}]}).count() == 0;
	},
	
	currentRequests:function() {
		return Request.find({$or:[{status:'accepted'},{status:'incomplete'}], delivered:false});
	},
	
	pendingRequests:function() {
		return Request.find({status:'pending', delivered:false});
	},
	
	pastRequests: function() {
		return Request.find({$or:[{delivered:true},{status:'declined'},{status:'canceled'}]})
	},
	
	formatName: function(buyerId){
		buyer = Meteor.users.findOne({_id:buyerId},{name:1});
		
		return buyer.name;
	},
	
	formatStatus: function(status, delivered) {
		if(status == 'incomplete'){
			return 'Incomplete Request'
		}else if(status == 'accepted'){
			return 'Accepted'
		}else if(status == 'pending'){
			return "Pending"
		}else if(status == 'declined'){
			return 'Declined';
		}else if(status == 'canceled'){
			return 'Canceled';
		}
	},
	
	isEmpty: function(value){
		var count;
		
		if(value == 'date'){
			count = Request.find(
				{	_id:this._id,
					date:{'$exists':true},
			}).count();
		}
		
		if(value == 'place'){
			count = Request.find(
				{	_id:this._id,
					place:{'$exists':true},
			}).count();
		}
		
		if(value == 'time'){
			count = Request.find(
				{	_id:this._id,
					time:{'$exists':true},
			}).count();
		}

		return count == 0 ? 'komo-hide':'';
	},
	
	itemCount: function(arr) {
		return arr.length;
	}
});
