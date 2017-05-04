var example_1 = switcher.items();

example_1.addTabs('#tab_1 span', function () {
	// Функция срабатывает при включении таба
	
	this.classList.add('tab_active');
	this.style.color = "black";
	
}, function () {
	// Функция срабатывает при отключении таба
	
	this.classList.remove('tab_active');
	this.style.color = "white";
});

example_1.addBlocks('#block_1 span'); // Функции включения и отключения используются по умолчанию: this.style.display = "block" / "none"; 
example_1.turnOn(1); // Включает 2-ой элемент, отсчет с нуля. При включении автоматически отключает ранее включенные элементы
