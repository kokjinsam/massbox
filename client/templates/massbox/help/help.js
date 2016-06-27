Template.help.onRendered(function(){
	$('html').addClass('komo-background__red');
});

Template.help.onDestroyed(function(){
	$('html').removeClass('komo-background__red');
});
