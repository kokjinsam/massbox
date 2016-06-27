Meteor.methods({
	'/seller/sign-up': function(){
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		var id = Meteor.userId();
		
		if(Roles.userIsInRole(id,['seller'])){
			throw new Meteor.Error(403, "You're already registered as a seller");
		}
		
		//add user to seller role
		Roles.addUsersToRoles(id,['seller']);
		
		//extend user 
		Meteor.users.update(
			{_id:id}, 
			{
				$set:{
					//set up seller votes
					sellerVotes:[],
			
					//seller account creation date
					sellerAccountCreatedOn: new Date(),
		
					//set up comments
					sellerComments:[] 
				}
			}
		);
		
		return;
	},
	
	'/item/seller/add': function(items) {
		//check inputs
		check(items, product_schema);
		
		//authentication
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		
		if(!Roles.userIsInRole(Meteor.userId(),['seller'])){
			throw new Meteor.Error(401, 'Please register as a seller');
		}
		
		if(items.status !== 'unlisted'){
			items.status = 'unlisted';
		}
		
		var id = Meteor.userId();
		
		//insert owner, created time, status
		items.owner = id;
		items.createdAt = new Date();
		items.changes = [];
		items.views = 0;
		
		//insert to database
		return Product.insert(items, function(err){
			if(err){
				throw new Meteor.Error(420, 'Unable to insert into database');
			}
		});
	},
	
	'/items/seller/picture/add': function(docId, pictures){
		//check inputs
		check(docId, String);
		check(pictures, Array);
		
		if(pictures.length > 5){
			throw new Meteor.Error(401, 'Maximum 5 pictures per item');
		}
		
		for(var i = 0; i < pictures.length; i++){
			check(pictures[i].url, String);
			check(pictures[i].width, Number);
			check(pictures[i].height, Number);
		}
		
		//authentication
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		if(!Roles.userIsInRole(Meteor.userId(),['seller'])){
			throw new Meteor.Error(401, 'Please register as a seller');
		}
		
		var seller = Meteor.userId();
		var productDoc = Product.direct.findOne({_id:docId});
		
		if(!productDoc) {
			throw new Meteor.Error(401,'Invalid product');
		}
		
		if(seller !== productDoc.owner){
			throw new Meteor.Error(401,'Invalid owner');
		}
		
		if(productDoc.status == 'requested' || productDoc.status == 'sold' || productDoc.status == 'removed'){
			throw new Meteor.Error(401,'Unable to edit item');
		}
		
		if(pictures.length <= 0){
			var changes = {
				updated: 'Status changed to unlisted',
				updatedBy: seller,
				updatedDate: new Date()
			}
			//update database
			Product.update(
				//selector
				{_id:docId, owner:seller},
				
				//modifier 
				{
					//update items
					$set:{
						status:'unlisted',
						pictures:pictures
					},
					
					//update changes
					$push:{
						changes: changes
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
		}else{
			var changes = {
				updated: 'Inserted Pictures',
				updatedBy: seller,
				updatedDate: new Date()
			}
				
			//update database
			Product.update(
				//selector
				{_id:docId, owner:seller},
				
				//modifier 
				{
					//update items
					$set:{
						status:'active',
						pictures:pictures
					},
					
					//update changes
					$push:{
						changes: changes
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
		
		return;
	},
	
	'/items/seller/edit': function(docId, items){
		
		//check inputs
		check(items, product_schema);
		check(docId, String);
		
		//authentication
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		if(!Roles.userIsInRole(Meteor.userId(),['seller'])){
			throw new Meteor.Error(401, 'Please register as a seller');
		}
		
		var seller = Meteor.userId();
		var productDoc = Product.direct.findOne({_id:docId});
		
		if(!productDoc) {
			throw new Meteor.Error(401,'Invalid product');
		}
		
		if(seller !== productDoc.owner){
			throw new Meteor.Error(401,'Invalid owner');
		}
		
		if(productDoc.status == 'requested' || productDoc.status == 'sold' || productDoc.status == 'removed'){
			throw new Meteor.Error(401,'Unable to edit item');
		}
		
		//check if pictures exist
		var pictures = Product.direct.find({_id:docId, pictures:{$exists: true}});
		
		if(!pictures){
			throw new Meteor.Error(401, 'Invalid Product');
		}
		
		//If no pictures, enforce status to unlisted
		if(pictures.count() == 0){
			items.status = 'unlisted';
		}

		if(productDoc.pictures){
			if(productDoc.pictures.length == 0){
				items.status = 'unlisted';
			}
		}
		
		//check if the inputs are the same as the original values
		var result = compareObject(productDoc, items);
		
		if(result){
			return {message:'no-update'};
		}else{
			var changes = {
				updatedBy: seller,
				updatedDate: new Date()
			}
			
			//update database
			Product.update(
				//selector
				{_id:docId, owner:seller},
				
				//modifier 
				{
					//update items
					$set:items,
					
					//update changes
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
			
			return {message:'updated-item'};
		}
	},
	
	'/items/seller/delete': function(docId) {
		//check inputs
		check(docId, String);
		
		//authentication
		if(!Meteor.userId()){
			throw new Meteor.Error(401, 'Please login to continue');
		}
		if(!Roles.userIsInRole(Meteor.userId(),['seller'])){
			throw new Meteor.Error(401, 'Please register as a seller');
		}
		
		var seller = Meteor.userId();
		var productDoc = Product.direct.findOne({_id:docId});
		
		if(!productDoc) {
			throw new Meteor.Error(401,'Invalid product');
		}
		
		if(seller !== productDoc.owner){
			throw new Meteor.Error(401,'Invalid owner');
		}
		
		if(productDoc.status == 'requested' || productDoc.status == 'sold' || productDoc.status == 'removed'){
			throw new Meteor.Error(401,'Unable to delete item');
		}
		
		var changes = {
				deletedBy: seller,
				deletedDate: new Date()
			}
			
		//update database
		Product.update(
			//selector
			{_id:docId, owner:seller},
			
			//modifier 
			{
				//update items
				$set:{
					status:'removed'
				},
				
				//update changes
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
		
		return;
	}
});
