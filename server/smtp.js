Meteor.startup(function(){
	smtp = {
		username: '****',
		password: '****',
		server: 'smtp.mailgun.org',
		port:587
	}
	
	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
	
});
