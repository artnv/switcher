// Переключение языков
var example_11_lang =  switcher.items();

	example_11_lang.addTabs('#lang span', function () {
		this.style.fontWeight = "bold";
	}, function () {
		this.style.fontWeight = "normal";
	});




// Окно с меню
var example_11_menu = switcher.items({backClickTurnOff: true});

	example_11_menu.addTabs('#menu', function () {
		this.innerHTML = "Меню &#9653;";
	}, function () {
		this.innerHTML = "Меню &#9662;";
	});
	
	example_11_menu.addBlocks('#menu_box');




// Переключение страниц
var example_11_pages = switcher.items();

	example_11_pages.addTabs('#tab_9 span', function () {
		this.classList.add('tab_active');
	}, function () {
		this.classList.remove('tab_active');
	});
	
	example_11_pages.addBlocks('#block_9 span');




// Выбор города
var example_11_city = switcher.items({backClickTurnOff: true});

	example_11_city.addTabs('#city', function () {
		this.style.color = "red";
		this.style.borderBottomColor = "red";
	}, function () {
		this.style.color = "#242525";
		this.style.borderBottomColor = "#242525";
	});
	
	example_11_city.addBlocks('#city_menu');

	


// Таблица с городами
var example_11_cityTable = switcher.items({backClickTurnOff: true});

	example_11_cityTable.addTabs('#city_menu table tr td', function () {
		document.getElementById("city").innerText = this.innerText;
		this.style.color = "red";
		example_11_city.turnOff();
	}, function () {
		this.style.color = "#242525";
	});




// Кнопка закрытия внутри таблицы с городами
var example_11_xbtn = switcher.items({backClickTurnOff: true});

	example_11_xbtn.addTabs('#xbtn', function () {
		example_11_city.turnOff();
	}, function () {
		example_11_city.turnOff();
	});



	
// ============= 

// Язык по умолчанию
example_11_lang.turnOn(0); 

// Страница по умолчанию
example_11_pages.turnOn(3);

// Раскрытие таблицы с выбором города
example_11_city.turnOn(0);	


// addEnemies и addFriends - используются для 10 и 11 примера

// Конфликтные элементы
switcher.addEnemies(example_10_1, example_10_2, example_10_3, example_10_4, example_11_city, example_11_menu);

// Дружественные группы. Группы позволяют комбинировать конфликтные элементы, делая их дружественные по отношению друг к другу
switcher.addFriends([example_10_1, example_10_3, example_11_city]);
