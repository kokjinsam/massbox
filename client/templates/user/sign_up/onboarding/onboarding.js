Template.onboarding.onCreated(function(){
	var instance = this,
			route = Router.current();
			page = route.params.page;
	instance.currentPage = new ReactiveVar(page);
});

Template.onboarding.helpers({
	showPage1: function(){
		var result = Template.instance().currentPage.get() == 1;
		
		if(result){
			$('html').removeClass();
			$('html').addClass('komo-background__lime');
		}
		return result;
	},
	
	showPage2: function(){
		var result = Template.instance().currentPage.get() == 2;
		
		if(result){
			$('html').removeClass();
			$('html').addClass('komo-background__sea');
		}
		return result;
	},
	
	showPage3: function(){
		var result = Template.instance().currentPage.get() == 3;
		
		if(result){
			$('html').removeClass();
			$('html').addClass('komo-background__light-green');
		}
		return result;
	},
	
	showPage4: function(){
		var result = Template.instance().currentPage.get() == 4;
		
		if(result){
			$('html').removeClass();
			$('html').addClass('komo-background__orange');
		}
		return result;
	},
	
	counter: function(){
		return Template.instance().currentPage.get();
	},
	
	hideBack: function(){
		var page = Template.instance().currentPage.get();
		
		if(page <= 1 || page > 4){
			return 'komo-hide';
		}
		
		return '';
	},
	
	hideNext: function(){
		var page = Template.instance().currentPage.get();
		
		if(page >= 4){
			return 'komo-hide';
		}
		
		return '';
	},
	
	showDone: function(){
		var page = Template.instance().currentPage.get();
		
		if(page == 4){
			return '';
		}
		
		return 'komo-hide';
	},
	
	hideSkip: function(){
		var page = Template.instance().currentPage.get();
		
		if(page >= 4){
			return 'komo-hide';
		}
		
		return '';
	}
});

Template.onboarding.events({
	'click #next':function() {
		var count = Template.instance().currentPage.get(),
				next = parseInt(count)+1;
		Template.instance().currentPage.set(next);
		Router.go('user.onboarding',{page:next});
		return;
	},
	
	'click #back':function() {
		var count = Template.instance().currentPage.get(),
				back = parseInt(count)-1;
		Template.instance().currentPage.set(back);
		Router.go('user.onboarding',{page:back});
		return;
	}
});

Template.onboarding.onDestroyed(function(){
	$('html').removeClass();
});
