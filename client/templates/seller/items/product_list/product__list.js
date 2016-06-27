Template.productList.helpers({
	getOnePic: function(objs){
		if(objs == undefined){
			return '/background/no_pic.jpg';
		}else{
			if(objs.length <= 0){
				return '/background/no_pic.jpg';
			}else{
				return objs[0].url;
			}
		}
	},
	
	setColor: function(value){
		if(value == 'active'){
			return 'komo-lime';
		}
		if(value == 'unlisted'){
			return 'komo-red';
		}
		if(value == 'requested'){
			return 'komo-blue';
		}
	}
});
