Meteor.methods({
	'/request/buyer/add': function(itemId){
		//check inputs
		check(itemId, String);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		var buyer = Meteor.userId(),
				itemDoc = Product.direct.findOne({_id:itemId}),
				seller = itemDoc.owner,
				itemStatus = itemDoc.status;
		
		//check if requester is the owner
		if(buyer == seller){
			throw new Meteor.Error(401, 'Owner is not allowed to make request');
		}
		
		//check if item is active. If not throw error
		if(itemStatus !== 'active'){
			throw new Meteor.Error(401, 'Unable to request item');
		}
		
		//check if a current request exist
		var requestDoc = Request.find(
			{
				buyer:buyer, 
				seller:seller,
				delivered:false,
				$or:[{status:'pending'},{status:'incomplete'},{status:'accepted'}]
		});
				
		var count = requestDoc.count();
		if(count === 0){
			
			//if count = 0, not found exisitng request, proceed to create new request
			var request = {};
			request.buyer = buyer;
			request.seller = seller;
			request.items = [itemId];
			request.status = 'incomplete';
			request.delivered = false;
			request.changes = [
				{
					addedItem: itemId,
					addedBy: buyer, 
					addedDate: new Date(),
				}
			];
			
			var requestId = Request.insert(request, function(err){
				if(err){
					throw new Meteor.Error(420, 'Unable to insert into database');
				}
			});
			
			return {
				message:'created-request',
				requestId:requestId
			};
			
		}else{
			
			//found an existing request
			//check duplicate item in the request
			var duplicateItemCount = Request.find({
					buyer:buyer, 
					seller:seller, 
					delivered:false,
					$or:[{status:'pending'},{status:'incomplete'},{status:'accepted'}], 
					items:itemId
			}).count();
			
			if(duplicateItemCount == 0){
				var requestQuery = Request.findOne({
					buyer:buyer, 
					seller:seller, 
					delivered:false,
					$or:[{status:'pending'},{status:'incomplete'},{status:'accepted'}], 
				});
				
				var changes = [],
						requestStatus = requestQuery.status,
						updateStatus = requestQuery.status;
						
				//update status to pending if status is accepted		
				if(requestStatus == 'accepted'){
					updateStatus = 'pending';
					var statusChanges = {
						changed: 'status from accepted to pending',
						changedBy: buyer,
						changedDate: new Date()
					}
					
					changes.push(statusChanges);
				}
				
				//if status is pending or accepted, update item status to 'requested'
				if(requestStatus == 'pending' || requestStatus == 'accepted'){
					//update item status, update changes
					var itemChanges = {
						updated:'status from active to requested',
						updatedBy: buyer,
						updatedDate: new Date()
					}
					
					Product.update(
						//selector
						{_id:itemId},
						
						//modifier
						{
							//update item status
							$set:{status:'requested'},
							
							//update changes
							$push:{
								changes:itemChanges
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
				
				var requestChanges = {
					addedItem: itemId,
					addedBy: buyer,
					addedDate: new Date()
				}
				
				changes.push(requestChanges);
				
				Request.update(
					//selector
					{
						buyer:buyer, 
						seller:seller,
						delivered:false,
						$or:[{status:'pending'},{status:'incomplete'},{status:'accepted'}]
					},
		
					//modifier 
					{
						//update requested item
						$push:{
							items:itemId,
						},
						
						//update request status
						$set:{
							status:updateStatus
						},
						
						//update changes
						$addToSet:{
							changes:{
								$each: changes
							}
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
				
				return {message:'updated-request'};
			}else{
				throw new Meteor.Error(420, 'Item already requested');
			}
				
		}
		
		
	},

	'/request/buyer/schedule': function(requestId, input){
		//check inputs
		check(requestId, String);
		check(input, request_schema);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		var requestDoc = Request.direct.findOne({_id:requestId},{buyer:1});
		
		if(!requestDoc){
			throw new Meteor.Error(402, 'Invalid request');
		}
		
		var requester = Meteor.userId(),
				buyer = requestDoc.buyer,
				items = requestDoc.items,
				inactiveItem = [],
				activeItem = [],
				message = {};

		//check if requester is the owner
		if(buyer !== requester){
			throw new Meteor.Error(401, 'Invalid buyer');
		}
		
		//check if items in the request are still active
		for(var i = 0; i < items.length; i++){
			var productQuery = Product.direct.findOne({_id:items[i]});
			
			if(!productQuery){
				throw new Meteor.Error(401, 'Invalid product');
			}
			
			if(productQuery.status !== 'active'){
				inactiveItem.push(items[i]);
			}else{
				activeItem.push(items[i]);
			}
		}
		
		//there is no active item in the request, cancel request
		if(activeItem.length <= 0){
			var statusChanges = {
					canceled: 'status from incomplete to canceled',
					changedBy: buyer,
					changedDate: new Date()
				};
				
			message.request = 'canceled-request'
			
			Request.update(
				//selector
				{_id:requestId},
	
				//modifier 
				{
					$set:{
						status:'canceled'
					},
					$push:{
						changes:statusChanges
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
			
			return message;
		}
		
		if(inactiveItem.length  > 0){
			var removedItemChanges = {
					'removedItem':inactiveItem,
					'removedBy':'Automated',
					'removedDate':new Date()
					};
			
			message.removedItem = inactiveItem.length;
					
			//update request, remove items, update changes
			Request.update(
				//selector
				{_id:requestId},
				
				//modifiers
				{
					//delete item
					$pull:{
						items:{$in:inactiveItem}
					},
					
					//update changes
					$push:{
						changes:removedItemChanges
					}
				},
				
				//callbacks
				function(err){
					if(err){
						throw new Meteor.Error(420, 'Unable to insert into database');
					}
				}
			);
		}
		
		//check if the inputs already exist
		var fieldCheck = Request.find(
			{	_id:requestId,
				date:{'$exists':true},
				time:{'$exists':true},
				place:{'$exists':true},
				method:{'$exists':true}
			}).count();

		if(fieldCheck === 0){			
			//change status from incomplete to pending
			input.status = 'pending';
			
			var statusChanges = {
					changed: 'status from incomplete to pending',
					changedBy: buyer,
					changedDate: new Date()
				};
				
			message.request = 'updated-request'
			
			Request.update(
				//selector
				{_id:requestId},
	
				//modifier 
				{
					$set:input,
					$push:{
						changes:statusChanges
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
			
			//update item status to requested
			var itemChanges = {
						updated:'status from active to requested',
						updatedBy: requester,
						updatedDate: new Date()
					};
					
			for(var i = 0; i < activeItem.length; i++){
				Product.update(
					//selector
					{_id:activeItem[i]},
					
					//modifier
					{
						$set:{status:'requested'},
						$push:{
							changes:itemChanges
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
			
			this.unblock();
			//send email
			var seller = requestDoc.seller,
					userQuery = Meteor.users.findOne({_id:seller});
					sellerEmail = userQuery.emails[0].address;
					sellerName = userQuery.name,
					buyerQuery = Meteor.users.findOne({_id:requester});
			
			SSR.compileTemplate('requestEmail', Assets.getText('requestEmail.html'));
			var html = SSR.render("requestEmail", {
				seller:sellerName, 
				method: input.method,
				date: input.date,
				place: input.place,
				time: input.time,
				name: buyerQuery.name,
				url:'http://massbox.io/seller/requests'
			});
			
			
      Email.send({
        from: 'MassBox <no-reply@massbox.io>',
        to: sellerEmail,
        subject: 'You have a request!',
        html: html
      });
		}else{
			throw new Meteor.Error(401, 'Request already scheduled');
		}
	},
	
	'/request/edit': function(requestId, inputs, items){
		//check inputs
		check(requestId, String);
		check(inputs, request_schema);
		check(items, request_item_schema);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}

		var request = Request.findOne({_id:requestId});
		if(!request){
			throw new Meteor.Error(402, 'Invalid request');
		}
		
		var requester = Meteor.userId(),
				buyer = request.buyer,
				seller = request.seller,
				status = request.status,
				delivered = request.delivered,
				response = {};

		//check if requester is the owner
		if(requester !== seller && requester !== buyer){
			throw new Meteor.Error(401, 'Not allowed to edit request');
		}
		
		//check if status is 'declined', 'canceled', 'incomplete' or 'delivered:true'
		if(status == 'declined' || status =='canceled' || status == 'incomplete' || delivered == true){
			throw new Meteor.Error(401, 'Unable to update '+status+' request');
		}
				
		//check if items deleted
		var removedItem = compareArray(items.items, request.items);
		
		//update changes, remove item, update item status
		if(removedItem != null){
			var changes = {
				'removedItem':removedItem,
				'removedBy':requester,
				'removedDate':new Date()
			};
			
			Request.update(
				//selector
				{_id:requestId},
				
				//modifiers
				{
					//delete item
					$pull:{
						items:{$in:removedItem}
					},
					
					//update changes
					$push:{
						changes:changes
					}
				},
				
				//callbacks
				function(err){
					if(err){
						throw new Meteor.Error(420, 'Unable to insert into database');
					}
				}
			);
			
			var itemChanges = {
				updated:'status from requested to active',
				updatedBy: buyer,
				updatedDate: new Date()
			}
			
			//update item status from requested to active
			for(var i = 0; i < removedItem.length; i++){
				Product.update(
					//selector
					{_id:removedItem[i]},
					
					//modifier
					{
						$set:{status:'active'},
						$push:{
							changes:itemChanges
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
			
			//write a message to response
			response.items = 'updated';
		
			//update request status to pending if status is accepted
			if(request.status == 'accepted'){
				inputs.status = 'pending';
			}
		}
		
		//check if the inputs are the same as original
		var result = compareObject(request, inputs);
		
		if(!result){
			
			//update request status to pending if status is accepted
			if(request.status == 'accepted'){
				inputs.status = 'pending';
			}
			
			var inputChanges = {
				changed:'Request details have been changed',
				changedBy:requester,
				changedDate: new Date()
			}
			
			//update request
			Request.update(
				{_id:requestId},
				
				//modifiers
				{
					//update inputs
					$set:inputs,
					
					//update changes
					$push:{
						changes:inputChanges
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
			
			//write a message to response
			response.inputs = 'updated';
			
			return response;
		}else{
			return response;
		}
	},
	
	'/request/cancel': function(requestId) {
		//check inputs
		check(requestId, String);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		var request = Request.findOne({_id:requestId});
		
		if(!request){
			throw new Meteor.Error(402, 'Invalid request');
		}
		
		var requester = Meteor.userId(),
				buyer = request.buyer,
				seller = request.seller,
				status = request.status,
				delivered = request.delivered,
				items = request.items;
		
		//check if requester is the owner
		if(requester !== seller && requester !== buyer){
			throw new Meteor.Error(401, 'Not allowed to cancel request');
		}
		
		if(status == 'canceled' || status == 'declined'){
			throw new Meteor.Error(401, 'Unable to cancel '+status +' request');
		}
		
		if(delivered == true){
			throw new Meteor.Error(401, 'Unable to cancel delivered request');
		}
		
		if(requester == seller){
			if(!Roles.userIsInRole(requester,['seller'])){
				throw new Meteor.Error(403, "Only seller can cancel");
			}
			
			if(status == 'incomplete' || status == 'pending'){
				throw new Meteor.Error(401, 'Unable to cancel '+status +' request');
			}
		}
		
		var changes = {
			canceledBy: requester,
			canceledDate: new Date()
		}
		
		//update request status to canceled, update changes
		Request.update(
			//selector
			{_id:requestId},
			
			//modifier
			{
				//update status
				$set:{
					status:'canceled'
				},
				
				//update changes
				$push:{
					changes:changes
				}
			},
			
			//options
			{upsert:true},
			
			//callback
			function(err){
				if(err){
					throw new Meteor.Error(420, 'Unable to insert into database');
				}
			}
		);
		
		//update item status from requested to active
		var itemChanges = {
				updated:'status from requested to active',
				updatedBy: buyer,
				updatedDate: new Date()
			}
			
		for(var i = 0; i < items.length; i++){
			Product.update(
				//selector
				{_id:items[i]},
				
				//modifier
				{
					$set:{status:'active'},
					$push:{
						changes:itemChanges
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
	
	'/request/seller/decide': function(requestId, decision) {
		//check inputs
		check(requestId, String);
		check(decision, String);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		if(!Roles.userIsInRole(Meteor.userId(),['seller'])){
			throw new Meteor.Error(403, "Only seller can respond");
		}
		
		var request = Request.findOne({_id:requestId});
		if(!request){
			throw new Meteor.Error(402, 'Invalid request');
		}
		
		var requester = Meteor.userId(),
				seller = request.seller,
				status = request.status,
				delivered = request.delivered,
				items = request.items;
		
		//check if requester is the owner
		if(requester !== seller){
			throw new Meteor.Error(401, 'Not allowed to respond');
		}
		
		if(status == 'accepted' || status == 'declined'){
			throw new Meteor.Error(401, 'Already responded to this request');
		}
		
		if(status == 'canceled' || status == 'incomplete'){
			throw new Meteor.Error(401, 'Unable to respond to '+status +' request');
		}
		
		if(delivered == true){
			throw new Meteor.Error(401, 'Unable to respond to delivered request');
		}
		
		//update request status, update changes
		var changes = {
			decision:decision,
			decidedBy:requester,
			decidedOn:new Date()
		}
		
		Request.update(
			//selector
			{_id:requestId},
			
			//modifier
			{
				$set:{
					status:decision
				},
				
				$push:{
					changes:changes
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
		
		//if decision = declined, update item status
		var itemChanges = {
				updated:'status from requested to active',
				updatedBy: seller,
				updatedDate: new Date()
			}
			
		if(decision == 'declined'){
			for(var i = 0; i < items.length; i++){
				Product.update(
					//selector
					{_id:items[i]},
					
					//modifier
					{
						$set:{status:'active'},
						$push:{
							changes:itemChanges
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
		}
	},
	
	'/request/seller/delivered': function(requestId) {
		//check inputs
		check(requestId, String);
		
		//check logged in
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		if(!Roles.userIsInRole(Meteor.userId(),['seller'])){
			throw new Meteor.Error(403, "Only seller can respond");
		}
		
		var request = Request.findOne({_id:requestId});
		if(!request){
			throw new Meteor.Error(402, 'Invalid request');
		}
		
		var requester = Meteor.userId(),
				seller = request.seller,
				status = request.status,
				requestDay = new Date(request.date),
				today = new Date(),
				requestDate = moment(requestDay).get('date');
				date = moment(today).get('date');
				delivered = request.delivered,
				items = request.items;
		
		console.log(date);
		console.log(requestDate);
		//check if requester is the owner
		if(requester !== seller){
			throw new Meteor.Error(401, 'Not allowed to respond');
		}
		
		if(status == 'canceled' || status == 'declined' || status == 'incomplete' || status == 'pending'){
			throw new Meteor.Error(401, 'Unable to update request');
		}
		
		if(delivered == true){
			throw new Meteor.Error(401, 'Unable to respond to delivered request');
		}
		
		if(requestDate > date){
			throw new Meteor.Error(401, 'Unable to update request');
		}
		
		if(status == 'accepted' && delivered == false){
			//update request status, update changes
			var changes = {
				delivered:true,
				deliveredBy:requester,
				deliveredOn:new Date()
			}
			
			Request.update(
				//selector
				{_id:requestId},
				
				//modifier
				{
					$set:{
						status:'accepted',
						delivered:true
					},
					
					$push:{
						changes:changes
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
		
			//if update item status
			var itemChanges = {
					updated:'status from requested to sold',
					updatedBy: seller,
					updatedDate: new Date()
				}
				
			for(var i = 0; i < items.length; i++){
				Product.update(
					//selector
					{_id:items[i]},
					
					//modifier
					{
						$set:{status:'sold'},
						$push:{
							changes:itemChanges
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
		}
	}
});
