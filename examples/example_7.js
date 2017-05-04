var example_7 = switcher.items({eventMethod: "mouseover"});


example_7.addTabs('#tab_6 span', function () {
	
	this.classList.add('tab_active');
	
}, function () {
	
	this.classList.remove('tab_active');
});

example_7.addBlocks('#block_6 img');
example_7.turnOn(0);	
