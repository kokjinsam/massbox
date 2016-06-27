Accounts.config({
	forbidClientAccountCreation: true,
	restrictCreationByEmailDomain: 'umn.edu',
	loginExpirationInDays:7
});

Accounts.onCreateUser(function(options,user){
	_.extend(user, {
		//add user to basic account
		roles:['basic'],
		
		//set up account
		dateOfBirth:'',
		onboarded:false
	});
	
	//send verification email
	Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
    console.log('sent');
  }, 2 * 1000);

	return user;
});

//Force email verification
Accounts.validateLoginAttempt(function(attempt){
  if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
    throw new Meteor.Error('email not verified');
  }
  return true;
}); 

if(Meteor.isServer){
Meteor.methods({
	'/users/sign-up':function(email, password, name) {
		//check user and name
		check(name, String);
		check(email, String);
		check(password, String);
		
		if(name.length <= 0 || name == undefined || name == ''){
			throw new Meteor.Error(403, 'Name is required');
		}
		
		if(email == '' || email == undefined){
			throw new Meteor.Error(403, 'Email is required');
		}
		
		if(password.length < 6 || password == undefined || password == ''){
			throw new Meteor.Error(403, 'Minimum password length is 6');
		}
		
		var newUserId = Accounts.createUser({email:email,password:password});
		
		if(newUserId){
			Meteor.users.update({_id:newUserId},{
				$set:{
					name:name
				}
			});
			
			return 'complete-signup';
		}else{
			return 'incomplete-signup';
		}
	},
	
	'/messages/send': function(message, roomId){
		//check inputs
		check(message, String);
		check(roomId, String);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		if(message.length > 140){
			throw new Meteor.Error(401, '140 words only');
		}
		 
		if(message.length <= 0){
			throw new Meteor.Error(401, 'Empty message is not allowed');
		}
		
		if(message == undefined || message == ''){
			throw new Meteor.Error(401, 'Invalid message');
		}
		
		//check if a conversation exists
		var result = Room.direct.findOne({_id:roomId});
			
		if(!result){
			throw new Meteor.Error(401, 'Invalid room ID');
		}
		
		var sender = Meteor.userId();
		//check if sender is in the room
		if(sender != result.buyer && sender != result.seller){
			throw new Meteor.Error(401, 'Invalid participants');
		}
		
		var recipient;
		if(sender == result.buyer){
			recipient = result.seller;
		}
		
		if(sender == result.seller){
			recipient = result.buyer;
		}
		
		//insert message to database		
		var messageId = Message.insert({
			room:roomId,
			sender:sender,
			recipient:recipient,
			message:message,
			timestamp:new Date(),
			status:'delivered'
		});	
		return messageId;
	},
	 
	'/messages/inquire': function (message, recipient) {
		//check inputs
		check(message, String);
		check(recipient, String);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		if(message.length > 140){
			throw new Meteor.Error(401, '140 words only');
		}
		 
		if(message.length <= 0){
			throw new Meteor.Error(401, 'Empty message is not allowed');
		}
		
		if(message == undefined || message == ''){
			throw new Meteor.Error(401, 'Invalid message');
		}
		
		var sender = Meteor.userId();
		if(sender == recipient){
			throw new Meteor.Error(401, 'Not allowed to send message');
		}
		
		//validate recipient
		var isUser = Meteor.users.direct.findOne({_id:recipient});
		if(!isUser){
			throw new Meteor.Error(401, 'Invalid Recipient');
		}
		
		//check if a conversation exists
		var result = Room.direct.findOne({
			buyer:sender,
			seller:recipient
		});
		
		if(result){
			//insert message to database
			Message.insert({
				room:result._id,
				sender:sender,
				recipient:recipient,
				message:message,
				timestamp:new Date(),
				status:'delivered'
			},
			
			//callbacks
			function(err){
				if(err){
					throw new Meteor.Error(420, 'Unable to insert into database');
				}
			});
			
			return 'message-sent'
		}else{
			//create new room
			var roomId = Room.insert(
				{
					buyer:sender,
					seller:recipient,
					createdAt:new Date()
				},
				
				//callbacks
				function(err){
					if(err){
						throw new Meteor.Error(420, 'Unable to insert into database');
					}
				}
			);
			
			//insert message to database
			Message.insert({
				room:roomId,
				sender:sender,
				message:message,
				timestamp:new Date(),
				status:'delivered'
			},
			
			//callbacks
			function(err){
				if(err){
					throw new Meteor.Error(420, 'Unable to insert into database');
				}
			});
			
			return 'message-sent'
		}
	},
	
	'/user/onboarded': function() {
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		var onboarded = Meteor.users.findOne({_id:Meteor.userId()}).onboarded;
		
		if(onboarded){
			throw new Meteor.Error(401, 'Already onboarded');
		}else{
			Meteor.users.update(
				{_id:Meteor.userId()},
				
				{
					$set:{
						onboarded:true
					}
				},
				
				//options
				{upsert:true},
				
				//callbacks
				function(err){
					if(err){
						throw new Meteor.Error(420, 'Unable to insert into database');
					}
				}
			);
		}
	},
	
	'/user/settings/profile/edit': function(name,dateOfBirth) {
		check(name, String);
		check(dateOfBirth, String);
		
		if(name.length > 100){
			throw new Meteor.Error(401, 'Max. Length for name is 100');
		}
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		Meteor.users.update(
			//selectors
			{_id:Meteor.userId()},
			
			//modifier
			{
				$set:{
					name:name,
					dateOfBirth:dateOfBirth
				}
			},
			
			//options
			{upsert:true},
			
			//callbacks
			function(err){
				if(err){
					throw new Meteor.Error(420, 'Unable to insert into database');
				}
			}
		);
	}
});
}
