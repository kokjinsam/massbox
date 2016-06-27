Template.about.onRendered(function(){
	$('html').addClass('komo-background__blue');
});

Template.about.onDestroyed(function(){
	$('html').removeClass('komo-background__blue');
});
