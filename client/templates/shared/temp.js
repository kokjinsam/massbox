Template.temp.onRendered(function(){
	openPhotoSwipe = function() {
	var pswpElement = document.querySelectorAll('.pswp')[0];

		// build items array
		var items = [
				{
						src: 'https://s3-us-west-2.amazonaws.com/massbox-product/2ezk8kacraNq26vE2.png',
						w: 964,
						h: 1024
				},
				{
						src: 'https://s3-us-west-2.amazonaws.com/massbox-product/56tmwEZqW6v56mj2g.jpg',
						w: 1024,
						h: 683
				},
				{
						src: 'https://s3-us-west-2.amazonaws.com/massbox-product/8G9fGypeqyEBoCPHN.jpg',
						w: 1024,
						h: 683
				}
		];
		
		// define options (if needed)
		var options = {
						 // history & focus options are disabled on CodePen        
				history: false,
				focus: false,
	
				showAnimationDuration: 0,
				hideAnimationDuration: 0
				
		};
		
		var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

});

Template.temp.events({
	'click #gallery': function (event, tmpl) {
		openPhotoSwipe();
	}
});
