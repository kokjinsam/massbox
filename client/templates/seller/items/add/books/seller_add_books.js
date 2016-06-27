Template.sellerAddBooks.onRendered(function(){
	var max4 = 4;
	$('input#input_class-number, input#input_class-title').keypress(function(event){
		if (event.which < 0x20) {
			return;
		}
		
		if (this.value.length == max4) {
			event.preventDefault();
		} else if (this.value.length > max4) {
			this.value = this.value.substring(0,max4);
		}
	});
});
