/*
 * Track users
 */
 
Meteor.methods({
  'track': function(routeURL){
		//check input
		check(routeURL,String);
		
		//check URL 
		
		//check authentication
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Not Logged In, tracking failed');
		}
		
		var id = Meteor.userId(),
				history = History.findOne({_id:id});
		
		//check 60 pages per hour
		
		
	}
});
