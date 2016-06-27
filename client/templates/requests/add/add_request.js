Template.addRequest.onRendered(function(){
	$('.datepicker').pickadate({
    selectMonths: true, 
    selectYears: 1,
    min:new Date(),
    max:false
  });
  
  $('html').addClass('komo-background__blue');
});

Template.addRequest.events({
	'submit #request-form': function(event, tmpl) {
		event.preventDefault();
		
		//collect inputs and serialize to JSON 
		var request = $('#request-form :input').serializeJSON();
		
		var route = Router.current();
		var requestId = route.params._id;

		Meteor.call('/request/buyer/schedule',requestId, request, function(err, result){
			if(err){
				Materialize.toast(err.message, 5000);
			}else{
				Materialize.toast('Request sent', 5000);
				Router.go('home');
			}
		});
	}
});

Template.addRequest.onDestroyed(function(){
	$('html').removeClass('komo-background__blue');
});
