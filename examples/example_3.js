var example_3 = switcher.items({backClickTurnOff: true});

example_3.addTabs('#tab_2 span', function () {
	
	this.classList.add('tab_active');
	this.style.color = "black";
	
}, function () {
	
	this.classList.remove('tab_active');
	this.style.color = "white";
});

example_3.addBlocks('#block_2 span');
example_3.turnOn(0);
