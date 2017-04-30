/*
	switcher.js 
	v0.4.1
*/

var switcher = {};

switcher.vars = {
	_enemyArr: [],
	_enemyElemCache: null,
	_enemiesEnabled: false,
	
	_friendsArgsArr: []
};

// Вызывается во всех методах
switcher.vars._enemyObserver = function(thatObj) {
	
	// thatObj - Объект элемент по которому кликнули
	
	var
		vars 				= switcher.vars,
		obj 				= vars._enemyArr,
		i 					= vars._enemyArr.length,
		cache				= vars._enemyElemCache;
	
	
	// Если есть кеш предыдущего объекта
	if(vars._enemyElemCache) {
		
		// Очищаем кеш повторного нажатия, в предыдущем объекте из массива
		vars._enemyElemCache.clearCache(); 
		
		// Проверяем дружественные объекты, если есть выходим и не даем их отключить
		if(vars.checkFriends(thatObj, vars._enemyElemCache)) {
			return true;
		}
		
		// Если это повторное нажатие, выходим
		if(Object.getPrototypeOf(vars._enemyElemCache) === thatObj) {
			return true;
		}
		
	}
	
	// Обходим все объекты в массиве enemies
	while(i--) {

		// Если есть кеш
		if(vars._enemyElemCache) {

			// Если это тот элемент на котором кликнули
			if(Object.getPrototypeOf(obj[i]) === thatObj) {

				// Если не первый раз запускается, то выключаем элемент который ранее был включен
				vars._enemyElemCache.turnOff();
				vars._enemyElemCache = obj[i]; // кешируем текущий
				
				if(vars._friendsArgsArr.length > 0) {
					
					// Отключение активных объектов из addFriends
					vars._turnOffAllFriends();

				}
				
				//break;
			}

		} else {
			
			vars._enemyElemCache = obj[i]; // кешируем текущий
			
		}

	}

};


// Добавляет объекты в массив
switcher.addEnemies = function() {
	
	var
		args 	= arguments,
		i 		= args.length,
		vars 	= switcher.vars;
	
	// Активизируем метод _enemyObserver
	if(i > 0) {
		vars._enemiesEnabled = true;
	}
	
	// Добавляем элементы
	while(i--) {
		if(typeof args[i] === "object") {
			vars._enemyArr.push(args[i]);
		}
	}
	

};

// Добавляет группы-объектов которые не будут выключены после addEnemies
switcher.addFriends = function() {
	
	var
		args 	= arguments,
		i 		= args.length,
		e		= 0,
		k		= 0;
		
		switcher.vars._friendsArgsArr = args;
	
	// По аргументам
	while(i--) {
		if(Array.isArray(args[i])) {
			//vars._friendsArr.push(args[i]);
			e = args[i].length;
		
			// По массиву в одном из аргументов
			while(e--) {
				
				k = args[i].length;
				
				// По тому же массиву, добавляя соседние объекты, при этом исключив себя
				while(k--) {
					
					// Если находим себя, то пропускаем
					if(args[i][e] !== args[i][k]) {
						
						// Добавляем дружественные объекты в массив
						args[i][e]._friendsObjArr.push(args[i][k]);
						
					}
					
				}
				
			}

		}
	}

};

// Отключает все дружественные элементы. Т.к. кеш тут не срабатывает из-за кол-ва активных
switcher.vars._turnOffAllFriends = function() {
	
	var
		vars 	= switcher.vars,
		arr 	= vars._friendsArgsArr,
		i		= arr.length;
		
		
	// По аргументам
	while(i--) {
		if(Array.isArray(arr[i])) {
			
			e = arr[i].length;
		
			// По массиву в одном из аргументов
			while(e--) {
				
				k = arr[i].length;
				
				// По тому же массиву
				while(k--) {
					
					// Если находим себя, то пропускаем
					if(arr[i][e] !== arr[i][k]) {
						
						// Отключаем
						arr[i][e].clearCache();
						arr[i][e].turnOff();
						
					}
					
				}
				
			}

		}
	}
	
};

// Проверяет дружественные объекты. Метод не дает отключить дружественные объекты, если они включаются друг с другом. Но отключаются при активации других из enemies
switcher.vars.checkFriends = function(clickObj, cacheObj) {
	
	var
		arr 	= clickObj._friendsObjArr,
		i 		= clickObj._friendsObjArr.length;
	
	
	// Элементы объекта по которому кликнули сравниваются с предыдущем объектом из кеша
	while(i--) {
		if(arr[i] === cacheObj) {
			return true;
		}
	}
	
	return false;
};


// Основной метод
switcher.items = function (userConfig) {

	// =============================== Vars
	var 
		R = {},
		_cacheElement, // Для выключения элемента, который ранее был включен
		_lock = false, // Включается методом .stop(). Если true, перестает реагировать на события, пока не будет вызван метод .next()
		
		// enemies
		_SwVars = switcher.vars,
		_enemyObserver = _SwVars._enemyObserver;	// Метод наблюдателя. 

		// friends
		R._friendsObjArr = []; // массив с дружественными объектами
		
		// Конфиг
		R._cfg = {
			eventMethod: "click",
			backClickTurnOff: false
		};
		
		// Блоки
		R._blocks = {
			arr: null,
			turnOn: function() { this.style.display = "block"; },
			turnOff: function() { this.style.display = "none"; }
		};
		
		// Табы, для переключения блоков
		R._tabs = {
			parentElem: null,
			arr: null,
			turnOn: function() {},
			turnOff: function() {}
		};
		
	// end vars
	
	// =============================== Methods
	

	// Обработчик событий, который вызывает методы turnOn
	R._listener = function () {
		
		// Если есть родительский элемент, то вешаем один обработчик
		if(R._tabs.parentElem) {
			R._tabs.parentElem.addEventListener(R._cfg.eventMethod, function(e) {
				
				// Блокировщик событий .stop() / .next()
				if(!_lock) {
					R.turnOn(e.target);
				}
				
			});
		} else {
			// Вешаем обработчики на все элементы, если нет родительского id
			// Реализация отложена
			console.log('not found parentElem');
		}
	};
	
	// Возвращает id из query строки. #abc li a => abc.
	R._getId = function (str) {
		return document.getElementById(str.match(/#([\w\d_-]+)/i)[1]);
	};
	
	
	// =============================== Public Methods
	
	// Очищает кеш повторного нажатия, нужен для enemies
	R.clearCache = function() {
		_cacheElement = null;
	};
	
	// Перестает реагировать на события, например пока анимация не завершится
	R.stop = function () {
		_lock = true;
	};
	
	// Возобновляет реагирование на события
	R.next = function () {
		_lock = false;
	};
	
	// Добавляет блоки
	R.addBlocks = function (QSA, turnOn, turnOff) {
		
		R._blocks.arr 	= 	document.querySelectorAll(QSA);
		
		if(typeof turnOn === "function") {
			R._blocks.turnOn	= 	turnOn;
		}
		
		if(typeof turnOff === "function") {
			R._blocks.turnOff	= 	turnOff;
		}
		
	};
	
	// Добавляет табы-переключатели
	R.addTabs = function (QSA, turnOn, turnOff) {
		
		R._tabs.arr 		= 	document.querySelectorAll(QSA);
		R._tabs.parentElem	=	R._getId(QSA);
		
		if(typeof turnOn === "function") {
			R._tabs.turnOn		=	turnOn;
		}
		
		if(typeof turnOff === "function") {
			R._tabs.turnOff		=	turnOff;
		}
	
		R._listener(); // обработчик событий
	};
	
	
	// Выключает предыдущий элемент
	R.turnOff = function() {
		
		var 
			i 				= R._tabs.arr.length,
			tabs 			= R._tabs,
			blocks			= R._blocks,
			blocksEnabled	= false; // Для того чтобы можно было использовать только табы без блоков
		
		if(blocks.arr && blocks.arr.length > 0) { 
			blocksEnabled = true;
			this.clearCache(); 
		}
			
		// Если первый запуск, отключаем все элементы
		if(typeof _cacheElement !== "number") { // default: _cacheElement = null

			while(i--) {
				
				// Свойство (позиция элемента) доступное внутри обработчика
				if(blocksEnabled) { blocks.arr[i].index = i; }
				tabs.arr[i].index 		= i;
				
				
				if(blocksEnabled) { blocks.turnOff.call(blocks.arr[i]) };
				
				if(tabs.turnOff) {
					tabs.turnOff.call(tabs.arr[i]);
				}
				
			}

		} else { // Все последующие запуски, после очистки

				// Свойство (позиция элемента) доступное внутри обработчика
				if(blocksEnabled) { blocks.arr[_cacheElement].index = _cacheElement; }
				tabs.arr[_cacheElement].index = _cacheElement;
				
			// Выключаем предыдущие элементы, блоки и табы
			if(blocksEnabled) { blocks.turnOff.call(blocks.arr[_cacheElement]); }
			
			if(tabs.turnOff) {
				tabs.turnOff.call(tabs.arr[_cacheElement]);
			}
			
		}
	
	}
	
	// Сначала все выключает, а потом включает конкретный блок и таб, по индексу или по e.target
	R.turnOn = function(ObjOrNum) {
		
		var 
			check, // функция проверки меняет условия в зависимости от параметров.  Цифра/Объект
			arrLn	= R._tabs.arr.length,
			i		= arrLn,
			tabs 	= R._tabs,
			blocks	= R._blocks,
			cfg		= R._cfg,
			blocksEnabled	= false; // Для того чтобы можно было использовать только табы без блоков
			
			
		if(blocks.arr && blocks.arr.length > 0) { blocksEnabled = true; }
		
		// формирование функции + дополнительная проверка на допустимый лимит в цифрах
		switch(typeof ObjOrNum) {
			case "object":
			
				check = function(i) {
					if(ObjOrNum === tabs.arr[i]) return true; else return false;
				};
				
			break;
			case "number":
			
				// Проверка допустимого лимита
				if(ObjOrNum > (arrLn-1) || ObjOrNum < 0) {
					return false;
				}
			
				check = function(i) {
					if(ObjOrNum === i) return true; else return false;
				};
		
			break;
			default: 
				return false;
			break;
		}
		
		
		// Включает конкретный блок и таб
		while(i--) {
			if(check(i)) {
				
				// Если повторный клик по тому же элементу
				if(_cacheElement === i) {
				
					// Если true, тогда при повторном нажатии на таб, применяется метод turnOff
					if(cfg.backClickTurnOff) {
						
						R.turnOff();
						_cacheElement = null;
						
					} else return true;
					
				} else {
					
					
					// Выключает ранее включенный элемент
					R.turnOff();

					
					// Если наблюдатель активирован (вызван метод enemies с аргументами - объектами), то запускаем
					if(_SwVars._enemiesEnabled) {
						_enemyObserver(this);
					}
					
					// Свойство (позиция элемента) доступное внутри обработчика
					if(blocksEnabled) { blocks.arr[i].index = i; }
					tabs.arr[i].index = i;
					
					// Включение блоков
					if(blocksEnabled) { blocks.turnOn.call(blocks.arr[i]); }
					
					// и табов
					if(tabs.turnOn) {
						tabs.turnOn.call(tabs.arr[i]);
					}

					// Кешируем элемент который собираемся включить, чтобы потом его же и отключить
					_cacheElement = i;
					

					// Выходим, т.к. нашли то что искали
					break;
				}

			}

		}
		
	}
	
	
	// =============================== init
	
	// Установка конфига, если есть
	if(typeof userConfig === "object") {
		
		for(var k in userConfig) {

			// Если в новом конфиге есть такие же свойства как и в локальном, то принимаем новые значения
			if(R._cfg.hasOwnProperty(k)) {
				R._cfg[k] = userConfig[k];
			}
			
		}
		
	}
	
	
	// Новый экземпляр
	return Object.create(R);
};
