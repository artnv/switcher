var example_4 = switcher.items({eventMethod: "mouseover"}); // Передается свойство в объекте, которое реагирует на mouseover. По умолчанию onclick

example_4.addTabs('#tab_3 span', function () {
	
	this.classList.add('tab_active');
	this.style.color = "black";
	
}, function () {
	
	this.classList.remove('tab_active');
	this.style.color = "white";
});

example_4.addBlocks('#block_3 span');
example_4.turnOn(2);	

