var example_8 = switcher.items({eventMethod: "mouseover"});

// Табы
example_8.addTabs('#tab_7 span', function () {
	this.classList.add('tab_active');
}, function () {
	this.classList.remove('tab_active');
});


// Блоки
example_8.addBlocks('#block_7 img', function() {
	
	var 
		i=0,
		that = this;
	
	this.style.opacity = 0;
	this.style.display = "block";
	
	// Удаляем таймер от предыдущего элемента, если есть
	clearInterval(example_8.varTimer);
	
	// Таймер
	example_8.varTimer = setInterval(function() {
		
		if(i >= 1) {
			clearInterval(example_8.varTimer);
		}
		
		i+=0.1;
		that.style.opacity = i;

	}, 50);
	
}, function() {
	
	this.style.display = "none";
	
});

example_8.turnOn(4);	