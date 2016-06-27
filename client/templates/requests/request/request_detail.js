Template.requestDetail.helpers({	
	hideCancel: function(){
		var route = Router.current(),
				requestId = route.params._id,
				request = Request.direct.findOne({_id: requestId});
	
		return (request.status == 'canceled' || request.status == 'declined' ) ||
					(request.status == 'pending' && request.seller == Meteor.userId()) ||
					request.delivered == true ? 'komo-hide':'';
	},
	
	showRespond: function(){
		var route = Router.current(),
				requestId = route.params._id,
				request = Request.direct.findOne({_id: requestId});
	
		return request.status == 'pending' && request.seller == Meteor.userId() ? '':'komo-hide';
	},
	
	showDelivered: function() {
		var route = Router.current(),
				requestId = route.params._id,
				request = Request.direct.findOne({_id: requestId}),
				today = new Date(),
				date = today.getDate(),
				requestDay = new Date(request.date),
				requestDate = requestDay.getDate();
		
		return request.status == 'accepted' && requestDate <= date && request.seller == Meteor.userId() && request.delivered == false? '':'komo-hide';
	},
	
	isSeller: function() {
		var route = Router.current(),
				requestId = route.params._id,
				request = Request.direct.findOne({_id: requestId}),
				user = Meteor.userId();

		if(user == request.seller) {
			return true;
		}else if(user == request.buyer){
			return false;
		}
	},
	
	formatName: function(id){
		user = Meteor.users.direct.findOne({_id:id},{name:1});
	
		return user.name;
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
		return value == '' || value == undefined ? 'komo-hide':'';
	}
});

Template.requestDetail.events({
	'click #cancel-request': function(event, tmpl) {
		event.preventDefault();
		
		var route = Router.current();
		var requestId = route.params._id;
		
		Meteor.call('/request/cancel', requestId, function(err, result){
			if(err){
				$('#cancel').closeModal();
				Materialize.toast(err.message, 4000)
			}else{
				$('#cancel').closeModal();
				Materialize.toast('Request canceled', 4000);
				history.back();
			}
		});
	},
	
	'submit form#make-decision': function(event, tmpl){
		event.preventDefault();
		
		var route = Router.current(),
				requestId = route.params._id,
				input = tmpl.find('input:radio[name=status]:checked');
		
		if(input){
			var response = input.value;
			
			Meteor.call('/request/seller/decide', requestId, response, function(err, result){
				if(err){
					$('#respond').closeModal();
					Materialize.toast(err.message, 4000)
				}else{
					$('#respond').closeModal();
					Materialize.toast(response+' request', 4000);
					history.back();
				}
			});
		}else{
			$('#respond').closeModal();
			Materialize.toast('Response needed', 4000)
		}
	},
	
	'click #deliver-request': function(event, tmpl) {
		event.preventDefault();
		
		var route = Router.current();
		var requestId = route.params._id;
		
		Meteor.call('/request/seller/delivered', requestId, function(err, result){
			if(err){
				$('#delivered').closeModal();
				Materialize.toast(err.message, 4000)
			}else{
				$('#delivered').closeModal();
				Materialize.toast('Request marked as delivered', 4000);
				history.back();
			}
		});
	}
});

Template.requestDetail.onRendered(function(){
	_.defer(function () {
		$('.modal-trigger').leanModal();
	});
});
