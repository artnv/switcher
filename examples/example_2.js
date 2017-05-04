var example_2 = switcher.items({backClickTurnOff: true}); // Передается свойство в объекте, которое позволяет включать и отключать один и тот же элемент.

example_2.addTabs('#exmp2_tab_1 span', function () {
	
	this.classList.add('tab_active');
	this.style.color = "black";
	
}, function () {
	
	this.classList.remove('tab_active');
	this.style.color = "white";
});
