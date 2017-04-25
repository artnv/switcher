var switcher = {};

switcher.vars = {
	_enemyArr: [],
	_enemyElemCache: null,
	_enemiesEnabled: false
};

// Вызывается во всех методах
switcher.vars._enemyObserver = function(thatObj) {

	var
		vars 	= switcher.vars;
		obj 	= vars._enemyArr,
		i 		= vars._enemyArr.length,
		cache	= vars._enemyElemCache;
	
	// Если есть кеш преыдущего объекта
	if(vars._enemyElemCache) {
		
		vars._enemyElemCache.clearCache(); // очищаем кеш повторного нажатия, в предыдущем объекте из массива
		
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
				
				//break;
			}

		} else {
			
			vars._enemyElemCache = obj[i]; // кешируем текущий
			
		}

	}

};


// Добавляет объекты в массив
switcher.enemies = function() {
	var
		args 	= arguments,
		i 		= args.length,
		vars 	= switcher.vars,
		arr		= vars._enemyArr;
	
	// Активизируем метод _enemyObserver
	if(i > 0) {
		vars._enemiesEnabled = true;
	}
	
	// Добавляем элементы
	while(i--) {
		if(typeof args[i] === "object") {
			arr.push(args[i]);
		}
	}

};

friends = function() {
	
};

switcher.items = function (userConfig) {

	// =============================== Vars
	var 
		R = {},
		_cacheElement, // Для выключения элемента, который ранее был включен
		_lock = false, // Включается методом .stop(). Если true, перестает реагировать на события, пока не будет вызван метод .next()
		
		// enemies
		_SwVars = switcher.vars,
		_enemyObserver = _SwVars._enemyObserver;	// Наблюдатель

		
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
	
	// Возвращает id из quey строки. #abc li a => abc.
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
		
		R._blocks.arr 		= 	document.querySelectorAll(QSA);
		
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
			i 		= R._tabs.arr.length,
			tabs 	= R._tabs,
			blocks	= R._blocks;
		
		// Если первый запуск, отключаем все элементы
		if(typeof _cacheElement !== "number") {

			while(i--) {
				
				blocks.turnOff.call(blocks.arr[i]);
				
				if(tabs.turnOff) {
					tabs.turnOff.call(tabs.arr[i]);
				}
				
			}

		} else { // Все последующие запуски, после очистки
			
			// Выключаем предыдущие элементы, блоки и табы
			blocks.turnOff.call(blocks.arr[_cacheElement]);
			
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
			cfg		= R._cfg;
		
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
					
					
					// Включение блоков
					blocks.turnOn.call(blocks.arr[i]);
					
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
