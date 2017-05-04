var example_9 = switcher.items({eventMethod: "mouseover"});

// Табы
example_9.addTabs('#tab_8 span', function () {
	
	this.classList.add('tab_active');
	
}, function () {
	
	this.classList.remove('tab_active');
});


// Блоки
example_9.addBlocks('#block_8 img', function() {

	var 
		i=0,
		that = this;
	
	// блокируем табы
	this.stop();
	
	this.style.opacity = 0;
	this.style.display = "block";
	
	clearInterval(example_9.varTimer);
	
	example_9.varTimer = setInterval(function() {
		
		if(i >= 1) {
			clearInterval(example_9.varTimer);	
			
			// После завершения, разблокируем
			that.next();
		}
		
		i+=0.1;
		that.style.opacity = i;

	}, 100);
	
}, function() {
	
	this.style.display = "none";
});

example_9.turnOn(2);
