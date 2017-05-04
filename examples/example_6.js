var example_6 = switcher.items({eventMethod: "mouseover"});

example_6.addTabs('#tab_5 span', function () {
	
	this.classList.add('tab_active');
	this.style.color = "black";
	
}, function () {
	
	this.classList.remove('tab_active');
	this.style.color = "white";
});

example_6.addBlocks('#block_5 span', function () {
	
	this.innerText = ('this.index: ' + this.index);
	
}, function () {
	
	this.innerText = '';
});
