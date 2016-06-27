Meteor.startup(function(){
	Message._ensureIndex({"room":1});
	Product._ensureIndex({"category":1, "method":1, "numberOfTimesUsed":1, "status":1, "type":1})
	
	Accounts.emailTemplates.from = "MassBox <no-reply@massbox.io>";
	Accounts.emailTemplates.siteName = 'MassBox';
	Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your UMN Email Address';
  };
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
		var greeting = (user && user.name) ?
           ("Hello " + user.name + ",") : "Hello,";

		return greeting + "\n"
					+ "\n"
					+ "To verify your UMN email, simply click the link below.\n"
					+ "\n"
					+ url + "\n"
					+ "\n"
					+ "Thanks.\n MassBox Team";
  };
});

Slingshot.createDirective("itemUploads", Slingshot.S3Storage, {
  bucket: "massbox-product",
  acl: "public-read",
	region: "us-west-2",
	allowedFileTypes: ["image/png", "image/jpeg"],
	maxSize: 10 * 1024 * 1024,
	
  authorize: function (file, metaContext) {
    if(!this.userId) {
      throw new Meteor.Error(401, 'Please login to continue');
    }
    
    var id = this.userId;
    if(!Roles.userIsInRole(id,['seller'])){
			throw new Meteor.Error(403, "Only sellers can post pictures");
		}
		
		var result = Product.direct.findOne({_id: metaContext.productId});
		
		if(!result) {
			throw new Meteor.Error(401, 'Invalid product');
		}
		
		if( id !== result.owner){
			throw new Meteor.Error(401, 'Invalid owner');
		}
		
		if(result.status == 'requested' || result.status == 'sold' || result.status == 'removed'){
			throw new Meteor.Error(401,'Unable to upload pictures');
		}
		
		var pictureExists = Product.direct.find({_id: metaContext.productId, pictures:{'$exists': true}});
		if(pictureExists.count() != 0){
			var pictures = result.pictures;
			if(pictures.length > 4){
				throw new Meteor.Error(401, 'Exceed max. amount of pictures');
			}
		}
		
    return true;
  },

  key: function (file, metaContext) {
		var ext = file.name.split('.').pop();
    return Random.id()+'.'+ext;
  }
});
