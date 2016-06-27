Template.sellerAddPictures.onCreated(function(){
	var route = Router.current(),
			docId = route.params._id,
			instance = this;
			
	instance.subReady = new ReactiveVar(false);
	
	var subscription = instance.subscribe('productPics', docId, {
		onReady: function(){
			instance.subReady.set(true);
			var picExist = Product.find({_id:docId, pictures:{$exists:true}}).count();
	
			if(picExist != 0){
				var pics = Product.direct.findOne({_id:docId}).pictures;
				Session.set('image_urls', []);
				Session.set('image_urls', pics);
				Session.set('picNotReady', false);
			}else{
				Session.set('image_urls', []);
			}
		},
		
		onError: function(err){
			throw 'There is an error: ' + err;
		}
	});
});

Template.sellerAddPictures.events({
	'change #file_picture': function(event, tmpl){
		event.preventDefault();
		
		var route = Router.current(),
				productId = route.params._id,
				urls = Session.get('image_urls'),
				metaContext = {
					productId:productId
				}
		
		if(urls.length > 4){
			Materialize.toast('Maximum 5 pictures per item', 4000);
			return;
		}
		
		var files = $('#file_picture').get(0).files;
		if (files.length > 0){
			var uploads = _.map(files, function (file){
				var uploader = new Slingshot.Upload("itemUploads", metaContext);
				
				//get image height and width
				var image = new Image();
				image.src = window.URL.createObjectURL( file );
				image.onload = function() {
					width = image.naturalWidth;
					height = image.naturalHeight;
				};
				
				var error = uploader.validate(file);
				if(error){
					Materialize.toast(error, 4000);
					return uploader;
				}else{
					//start loading
					Session.set('picNotReady', true);
					
					//upload image
					uploader.send(file, function (error, downloadUrl) {
							if(error){
								Materialize.toast(error, 4000);
							}else{
								var picObj = {
									url:downloadUrl,
									width:width,
									height:height
								}
								
								//display uploaded picture
								urls.push(picObj);
								Session.set('image_urls', urls);
								
								//end loading
								Session.set('picNotReady', false);
								
								//upload pic URL
								Meteor.call('/items/seller/picture/add', productId, urls, function(err, result){
									if(err){
										Materialize.toast(err, 4000);
									}else{
										Materialize.toast('Added pictures to item', 4000);
									}
								});
							}
					});
				}
				
				return uploader;
			});
			
			return;
		}else{
			return;
		}
	},
	
	'click .komo-image__delete': function(){
		var url_array = Session.get('image_urls'),
				search_image = this.url,
				route = Router.current(),
				productId = route.params._id
		
		for(var i = 0; i < url_array.length; i++){
			if(url_array[i].url == search_image){
				url_array.splice(i,1);
			}
		}
		
		Session.set('image_urls', url_array);
		
		//upload pic URL
		Meteor.call('/items/seller/picture/add', productId, url_array, function(err, result){
			if(err){
				Materialize.toast(err, 4000);
			}else{
				Materialize.toast('Delete pictures from item', 4000);
			}
		});
	}
});

Template.itemPictures.helpers({
	upload_images: function(){
		return Session.get('image_urls');
	}
});

Template.sellerAddPictures.helpers({
	picIsNotReady: function(){
		return Session.get('picNotReady');
	},
	
	hideUpload: function(){
		if(Template.instance().subReady.get()){
			return Session.get('image_urls').length > 4 ? 'komo-hide':'';
		}
	}
});

