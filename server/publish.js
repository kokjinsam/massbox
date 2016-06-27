/*
 * Seller, For item listing
 */
Meteor.publish('products', function(type){
	check(type, String);
	
	if(type != 'active' && type != 'unlisted' && type != 'requested' && type != 'sold') return this.ready();
	if(!this.userId) return this.ready();
	if(!Roles.userIsInRole(this.userId,['seller'])) return this.ready();
	
	var userId = this.userId, 
			products = Product.direct.find({owner:userId, status:type},{
				fields:{
					status:1,
					price:1,
					views:1,
					pictures:1
				}
			});
	
	if(products) return products;
	
	return this.ready(); 
});

/*
 *  Seller, For item editing
 */
Meteor.publish('productDetail', function(docId){
	check(docId, String);
	
	if(!this.userId) return this.ready();
	
	if(!Roles.userIsInRole(this.userId,['seller'])) return this.ready();
	
	var userId = this.userId;
	var product = Product.direct.findOne({_id:docId});
	
	if(userId !== product.owner) return this.ready();
	
	if(product.status == 'sold' || product.status == 'removed') return this.ready();
	
	var productDetail = Product.direct.find({owner:userId, _id:docId},{
		fields:{
			changes:0,
			views:0
		}
	});
	
	if(productDetail) return productDetail;
	
	return this.ready();
});

/*
 * Seller, For adding pictures
 */
Meteor.publish('productPics', function(docId){
	check(docId, String);
	
	if(!this.userId) return this.ready();
	
	if(!Roles.userIsInRole(this.userId,['seller'])) return this.ready();
	
	var userId = this.userId;
	var product = Product.direct.findOne({_id:docId});
	
	if(userId !== product.owner) return this.ready();
	
	if(product.status == 'sold' || product.status == 'removed' || product.status == 'requested') return this.ready();
	
	var productPics = Product.direct.find({owner:userId, _id:docId},{
		fields:{
			pictures:1
		}
	});
	
	if(productPics) return productPics;
	
	return this.ready();
});

/*
 * Public, For item list viewing
 */

Meteor.publish('productList', function(filters, skip, limit){
	check(filters, Object);
	check(skip, Number);
	check(limit, Number);
	
	var filterObj = {status:'active'};
		
	//concat a filter object
	for(key in filters){
		//eliminate empty or 0 values
		if(filters[key] != '' && filters[key] != 0 && filters[key] != undefined && key != 'price'){
			//check if it's number
			if(typeof filters[key] == 'number'){
				filterObj[key] = {$gte:filters[key]}
			}else{
				filterObj[key] = filters[key];
			}
		}
	}
	
	//publish products count
	Counts.publish(this, 'products-count', Product.direct.find(filterObj), { noReady: true });
	
	//return products count
	return Product.direct.find(
		filterObj,
		{
			skip:skip,
			limit:limit,
			sort:{
				price:1
			},
			fields:{
				price:1,
				views:1,
				pictures:1
			}
		}
	);
});

/*
 * Public, For individual item viewing
 */

Meteor.publish('product', function(docId){
	check(docId, String);
		
	//track views
	var productDoc = Product.findOne({_id:docId});
	if(!productDoc) return this.ready();
	
	if(productDoc.status == 'removed') this.ready();
	
	var	product = Product.direct.find({_id:docId},{
				fields:{
					changes:0
				}
			}),
			owner = Meteor.users.direct.find({_id:productDoc.owner},{
				fields:{
					name:1
				}
			});
	
	if(product && owner) return [product, owner];
	
	return this.ready();
});

/*
 * Buyer, For request listing
 */

Meteor.publish('buyerRequests', function(){
	if(!this.userId) return this.ready();
	
	var requests = Request.direct.find({buyer:this.userId});
	if(!requests) return this.ready();
	
	var sellers = requests.map(function(o){return o.seller});
	if(!sellers) return this.ready();
	
	var buyerRequests = Request.direct.find({buyer:this.userId},{
				fields:{
					changes:0
				}
			}),
			sellerNames = Meteor.users.find({_id:{$in:sellers}},{
				fields:{
					name:1
				}
			});
	
	if(buyerRequests && sellerNames) return [buyerRequests, sellerNames];
	
	return this.ready();
});

/*
 * Seller, For request listing
 */

Meteor.publish('sellerRequests', function(){
	if(!this.userId) return this.ready();
	
	var requests = Request.direct.find({seller:this.userId});
	if(!requests) return this.ready();
	
	var buyers = requests.map(function(o){return o.buyer});
	if(!buyers) return this.ready();
	
	var sellerRequests = Request.direct.find({seller:this.userId, status:{$in:['pending','declined','accepted','canceled']}},{
				fields:{
					changes:0
				}
			}),
			buyerNames = Meteor.users.direct.find({_id:{$in:buyers}},{
				fields:{
					name:1
				}
			});
	
	if(sellerRequests && buyerNames) return [sellerRequests, buyerNames];
	
	return this.ready();
});

/*
 * Buyer and Seller, For individual request
 */

Meteor.publish('request', function(requestId){
	check(requestId, String);
	
	if(!this.userId) return this.ready();
	
	var userId = this.userId;
	var requestDoc = Request.direct.findOne({_id:requestId});

	if(requestDoc.buyer !== userId && requestDoc.seller !== userId) return this.ready();
	
	var users = [requestDoc.seller,requestDoc.buyer];
	
	var request = Request.direct.find({_id:requestId},{
			fields:{
				changes:0
			}
		}),
		
		names = Meteor.users.direct.find({_id:{$in:users}},{
			fields:{
				name:1
			}
		}),
		
		productPrice = Product.direct.find({_id:{$in:requestDoc.items}},{
			fields:{
				price:1
			}
		});
		
	if(request && names && productPrice) return [request, names, productPrice];
	
	return this.ready();
});

/*
 * Buyer and Seller, For invidual request editing
 */ 

Meteor.publish('editRequest', function(requestId){
	check(requestId, String);
	
	if(!this.userId) return this.ready();
	
	var userId = this.userId;
	var requestDoc = Request.direct.findOne({_id:requestId});

	if(requestDoc.buyer !== userId && requestDoc.seller !== userId) return this.ready();
	
	if(requestDoc.status == 'declined' || requestDoc.status == 'canceled' || requestDoc.delivered == true) return this.ready();
	
	var editRequest = Request.direct.find({_id:requestId},{
				fields:{
					changes:0
				}
			}),
			productPrice = Product.direct.find({_id:{$in:requestDoc.items}},{
				fields:{
					price:1
				}
			});
			
	if(editRequest && productPrice) return [editRequest, productPrice];
	
	return this.ready();
});

/*
 * User, for individual profile settings viewing
 */

Meteor.publish('userSettings', function(){
	if(!this.userId) return this.ready();
	
	var userId = this.userId,
			profile = Meteor.users.direct.find({_id:userId},{
				fields:{
					dateOfBirth:1,
					preferences:1,
					name:1
				}
			});
	
	if(profile) return profile;
	
	return this.ready();
});

/*
 * User, for onboarding
 */

Meteor.publish('userOnboard', function(){
	if(!this.userId) return this.ready();
	
	var userId = this.userId,
			profile = Meteor.users.direct.find({_id:userId},{
				fields:{
					onboarded:1
				}
			});
	
	if(profile) return profile;
	
	return this.ready();
});

/*
 * Buyer, for message list
 */

Meteor.publish('rooms', function(mode){
	check(mode, String);
	
	if(!this.userId) return this.ready();
	var users = [];
			
	if(mode == 'buyer'){
		var userId = this.userId,
				roomDocs = Room.direct.find({buyer:userId},{
					sort:{
						
					},
					fields:{
						seller:1
					}
				});
	
		if(!roomDocs) this.ready();
		
		Room.direct.find({buyer:userId}).forEach(function(doc){
			if(users.indexOf(doc.seller) == -1){
				users.push(doc.seller);
			}
		});
	}
	
	if(mode == 'seller'){
		var userId = this.userId,
				roomDocs = Room.direct.find({seller:userId},{
					fields:{
						buyer:1
					}
				});
	
		if(!roomDocs) this.ready();
		
		Room.direct.find({seller:userId}).forEach(function(doc){
			if(users.indexOf(doc.buyer) == -1){
				users.push(doc.buyer);
			}
		});
	}
	
	var names = Meteor.users.direct.find({_id:{$in:users}},{
		fields:{
			name:1
		}
	});
		
	if(names && roomDocs) return [names, roomDocs]; 
	
	return this.ready();
});

Meteor.publish('oneLineMessage', function(mode){
	check(mode, String);
	
	var sub = this;
	var initializing = true;
	
	if(!sub.userId) return this.ready();
	
	var rooms = [],
			userId = sub.userId;
	
	if(mode == 'buyer'){
		var roomDocs = Room.direct.find({buyer:userId});
				
		if(!roomDocs) sub.ready();
		Room.direct.find({buyer:userId}).forEach(function(doc){
			rooms.push(doc._id);
		});
	}
	
	if(mode == 'seller'){
		var roomDocs = Room.direct.find({seller:userId});
				
		if(!roomDocs) sub.ready();
		Room.direct.find({seller:userId}).forEach(function(doc){
			rooms.push(doc._id);
		});
	}
	
	var pipeline =[
		{$match:{room:{$in:rooms}}},
		{$sort:{timestamp:-1}},
		{$group:{_id:"$room",messages:{"$first":"$message"}, status:{"$first":"$status"}, sender:{"$first":"$sender"}}}
	];
	
	var query = Message.direct.find({room:{$in:rooms}});
  var handle = query.observeChanges({
    added: function (id) {
      if (!initializing) {
        runAggregation('changed');
      }
    },
    removed: function (id) {
      runAggregation('changed');
    },
    changed: function (id) {
      runAggregation('changed');
    },
    error: function(err){
      throw new Meteor.Error('Uh oh! something went wrong!', err.message);
    }
  });

  initializing = false;
  runAggregation('added');
  
	function runAggregation(action){
    Message.aggregate(pipeline).forEach(function(e) {
      if(action === 'changed'){
        sub.changed('oneLineMessage', e._id, {
          _id: e._id,
          message: e.messages,
          status: e.status,
          sender: e.sender
        });
      }
      else {
        sub.added('oneLineMessage', e._id, {
          _id: e._id,
          message: e.messages,
          status: e.status,
          sender: e.sender
        });
      }
      sub.ready();
    });
  }
  
  sub.onStop(function () {
    handle.stop();
  });
});

/*
 * Buyer, for individual message room viewing
 */

Meteor.publish('room', function(roomId){
	check(roomId, String);
	
	if(!this.userId) return this.ready();
	
	var room = Room.direct.findOne({_id:roomId}),
			userId = this.userId;

	if(!room) return this.ready();
	
	if(room.buyer != userId && room.seller != userId) return sub.ready();
	
	var messages = Message.direct.find({room:roomId},{
		sort:{
			timestamp:1
		},
		fields:{
			sender:1,
			message:1,
			status:1
		}
	});
	
	var users = Meteor.users.direct.find({_id:{$in:[room.buyer, room.seller]}},{
		fields:{
			name:1
		}
	});
	
	var handle = messages.observeChanges({
    added: function (id, message) {			
			if(userId !== message.sender){
	      Message.update(
					//selector
					{_id:id},
					
					//modifier
					{
						$set:{
							status:'seen',
							seenAt: new Date()
						}
					},
					
					//options
					{upsert:true}
				);
			}
    },
    error: function(err){
      throw new Meteor.Error('Uh oh! something went wrong!', err.message);
    }
  });

	this.onStop(function () {
    handle.stop();
  });
  
  if(messages && users) return [messages, users];
  
  return sub.ready();
});

/*
 * Public, type, brand, make, color aggregation
 */
Meteor.publish('filterOptions', function(){
	var sub = this,
			initializing = true;
	
	var pipeline =[
		{$match:{status:'active'}},
		{$group:{_id:"$category",type:{$addToSet:"$type"}}}
	];
	
	var query = Product.direct.find();
  var handle = query.observeChanges({
    added: function (id) {
      if (!initializing) {
        aggregate('changed');
      }
    },
    removed: function (id) {
      aggregate('changed');
    },
    error: function(err){
      throw new Meteor.Error('Uh oh! something went wrong!', err.message);
    }
  });

  initializing = false;
  aggregate('added');
  
	function aggregate(action){
    Product.aggregate(pipeline).forEach(function(e) {
      if(action === 'changed'){
        sub.changed('filterOptions', e._id, {
          _id: e._id,
          type: e.type
        });
      }
      else {
        sub.added('filterOptions', e._id, {
          _id: e._id,
          type: e.type
        });
      }
      sub.ready();
    });
  }
  
  sub.onStop(function () {
    handle.stop();
  });
});

/*
 * Seller, for dashboard count
 */

Meteor.publish('dashboard', function(){
	if(!this.userId) return this.ready();
	
	var userId = this.userId;
	var queries = Room.direct.find({seller:userId}),
			rooms = [];
	
	if(queries.count() > 0){
		queries.forEach(function(doc){
			rooms.push(doc._id);
		});
	}
	
	Counts.publish(this, 'request-count', Request.direct.find({seller:userId, status:{$in:['pending']}}), { noReady: true });
	Counts.publish(this, 'message-count', Message.direct.find({room:{$in:rooms},recipient:userId, status:'delivered'}),{noReady: true});
	
	var anotherQueries = Room.direct.find({buyer:userId}),
			anotherRooms = [];
		
	if(anotherQueries.count() > 0){
		anotherQueries.forEach(function(doc){
			anotherRooms.push(doc._id);
		});
	}
	Counts.publish(this, 'item-count', Product.direct.find({owner:userId, status:{$in:['active']}}), { noReady: true });
	Counts.publish(this, 'request-buyer-count', Request.direct.find({buyer:userId, status:{$in:['pending','incomplete']}}), { noReady: true });
	Counts.publish(this, 'message-buyer-count', Message.direct.find({room:{$in:anotherRooms},recipient:userId, status:'delivered'}),{noReady: true});
	
	return this.ready();
});
