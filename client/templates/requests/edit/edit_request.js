Template.editRequest.onCreated(function(){
	var instance = this;
	var route = Router.current();
	var requestId = route.params._id;
	
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('editRequest', requestId, {
		onReady: function(){
			instance.subReady.set(true);
		},
		
		onError: function(err){
			Materialize.toast(err, 4000);
		}
	});	
});

Template.editRequest.onRendered(function(){
	$('.datepicker').pickadate({
    selectMonths: true, 
    selectYears: 1,
    min:new Date(),
    max:false
  });
});

Template.editRequest.events({
	'submit form#edit-request': function(event, tmpl) {
		event.preventDefault();
		
		//collect inputs and serialize to JSON 
		var request = $('#edit-request :input[id^="input"]').serializeJSON();
		var items = $('#edit-request :input[id^="check"]').serializeJSON();
		
		var route = Router.current();
		var requestId = route.params._id;
		
		//if(isNotEmpty(request.place) && isNotEmpty(request.date) && isNotEmpty(request.time)){
			Meteor.call('/request/edit', requestId, request, items, function(err, result){
				if(err){
					if(err.message == 'an array of items requested is required [400]'){
						Materialize.toast('Please cancel request', 4000);
					}else{
						Materialize.toast(err.message, 4000);
					}
				}else{
					if(result){
						if(result.items == 'updated' || result.inputs == 'updated'){
							Materialize.toast('Update was successful', 4000);
							history.back();
						}else{
							Materialize.toast('Request was not updated', 4000);
							history.back();
						}
					}
				}
			});
		//}
		
		return;
	}
});

Template.editRequest.helpers({
	isEmptySub: function(){
		if(Template.instance().subReady.get()){
			var route = Router.current();
			var requestId = route.params._id;
			return Request.find({_id: requestId}).count() == 0;
		}
	},
	
	editNotAllowed: function(){
		if(Template.instance().subReady.get()){
			var route = Router.current(),
					requestId = route.params._id,
					requestDoc = Request.findOne({_id:requestId});
					status = requestDoc.status;
					
			return (status == 'pending' || status == 'incomplete' || status == 'accepted') ? false:true;
		}
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
	
	methodOption: function() {
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
	
	isSelected: function(value, method){
		return value == method ? 'selected':'';
	}
});
