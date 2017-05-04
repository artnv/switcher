// Привязка только к id, а не к nodelist

var example_5 = switcher.items({backClickTurnOff: true});

// Табы
example_5.addTabs('#once_tab', function () {
	
	this.classList.add('tab_active');
	this.innerHTML = "Еще!";
	
}, function () {
	
	this.innerHTML = "Мало!";
	this.classList.remove('tab_active');
});


// Блоки
// Первая функция запускается при включении блока, а вторая после отключения
example_5.addBlocks('#once_block', function () {
	
	this.innerHTML = "turnOn";
	
}, function () {
	
	this.innerHTML = "turnOff";
});
