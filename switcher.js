var switcher = {};
switcher.items = function (userConfig) {
	
	// =============================== Vars
	var 
		R = {},
		cacheElement, // Для выключения элемента, который ранее был включен
		lock = false; // если true, перестает реагировать на события, пока не будет вызван метод .next()
		
		// Конфиг
		R._cfg = {
			eventMethod: "click",
			backClickTurnOff: false
		};
		
		// Блоки
		R._blocks = {
			arr: null,
			arrLn: null,
			turnOn: function() { this.style.display = "block"; },
			turnOff: function() { this.style.display = "none"; }
		};
		
		// Табы, для переключения блоков
		R._tabs = {
			parentElem: null,
			arr: null,
			arrLn: null,
			turnOn: function() { this.style.fontWeight = "bold"; },
			turnOff: function() { this.style.fontWeight = "normal"; }
		};
		
	// end vars
	
	// =============================== Methods
	
	// Перестает реагировать на события, например пока анимация не завершится
	R.stop = function () {
		lock = true;
	};
	
	// Возобновляет реагирование на события
	R.next = function () {
		lock = false;
	};
	
	// Обработчик событий, который вызывает методы turnOn
	R._listener = function () {
		// Если есть родительский элемент, то вешаем один обработчик
		if(R._tabs.parentElem) {
			R._tabs.parentElem.addEventListener(R._cfg.eventMethod, function(e) {
				
				// Блокировщик событий .stop() / .next()
				if(!lock) {
					R.turnOn(e.target);
				}
				
			});
		} else {
			// вешаем обработчики на все элементы, если нет родительского id
			// Реализация пока отложена
			console.log('not found parentElem');
		}
	};
	
	// Возвращает id из quey строки. #abc li a => abc.
	R._getId = function (str) {
		return document.getElementById(str.match(/#([\w\d_-]+)/i)[1]);
	};
	
	// =============================== Public Methods
	
	// Добавляет блоки
	R.addBlocks = function (QSA, turnOn, turnOff) {
		
		R._blocks.arr 		= 	document.querySelectorAll(QSA);
		R._blocks.arrLn 	= 	R._blocks.arr.length;
		
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
		R._tabs.arrLn 		= 	R._tabs.arr.length;
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
	
		// Если первый запуск, отключаем все элементы
		if(typeof cacheElement !== "number") {
			
			for(var i=R._tabs.arrLn;i--;) {
				
				R._blocks.turnOff.call(R._blocks.arr[i]);
				
				if(R._tabs.turnOff) {
					R._tabs.turnOff.call(R._tabs.arr[i]);
				}
				
			}

		} else {
			// Все последующие запуски, после очистки
		

			// Выключаем предыдущие элементы, блоки и табы
			R._blocks.turnOff.call(R._blocks.arr[cacheElement]);
			
			if(R._tabs.turnOff) {
				R._tabs.turnOff.call(R._tabs.arr[cacheElement]);
			}
			
		}
		
		
	}
	
	// Сначала все выключает, а потом включает конкретный блок и таб, по индексу или по e.target
	R.turnOn = function(ObjOrNum) {
		
		var check; // функция проверки меняет условия в зависимости от параметров.  Цифра/Объект
		
		// формирование функции + дополнительная проверка на допустимый лимит в цифрах
		switch(typeof ObjOrNum) {
			case "object":
			
				check = function(i) {
					if(ObjOrNum === R._tabs.arr[i]) return true; else return false;
				};
				
			break;
			case "number":
			
				// Проверка допустимого лимита
				if(ObjOrNum > (R._tabs.arrLn-1) || ObjOrNum < 0) {
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
		for(var i=R._tabs.arrLn;i--;) {
			if(check(i)) {
				
				// Если повторный клик по тому же элементу
				if(cacheElement === i) {
					
					// Если true, тогда при повторном нажатии на таб, применяется метод turnOff
					if(R._cfg.backClickTurnOff) {
						
						R.turnOff();
						cacheElement = null;
						
					} else return true;
					
				} else {
					
					// Выключает ранее включенный элемент
					R.turnOff();

					// Включение блоков
					R._blocks.turnOn.call(R._blocks.arr[i]);
					
					// и табов
					if(R._tabs.turnOn) {
						R._tabs.turnOn.call(R._tabs.arr[i]);
					}
					
					// Кешируем элемент который собираемся включить, чтобы потом его же и отключить
					cacheElement = i;
					
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
