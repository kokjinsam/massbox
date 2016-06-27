Product.after.findOne(function(userId, selector, options, doc){
	//update item count
	if(userId !== doc.owner){
		Product.direct.update(
			//selector
			{_id: doc._id},
			
			//modifier
			{
				$inc:{
					views: 1
				}
			},
			
			//options
			{upsert:true},
			
			//callbacks
			function(err){
				if(err){
					throw new Meteor.Error(420, 'Unable to update database');
				}
			}
		);
	}
});

