// 1
var example_10_1 = switcher.items({eventMethod: "mouseover"});

	example_10_1.addTabs('#exm10_tab_1 span', function () {
		this.classList.add('tab_active');
	}, function () {
		this.classList.remove('tab_active');
	});

	example_10_1.addBlocks('#exm10_block_1 span', function () {
		this.style.fontWeight = "bold";
		this.innerText = ': '+this.index;
	}, function () {
		this.innerText = '';
		this.style.fontWeight = "normal";
	});

// 2
var example_10_2 = switcher.items({eventMethod: "mouseover"});

	example_10_2.addTabs('#exm10_tab_2 span', function () {
		this.classList.add('tab_active');
	}, function () {
		this.classList.remove('tab_active');
	});

	example_10_2.addBlocks('#exm10_block_2 span', function () {
		this.style.fontWeight = "bold";
		this.innerText = ': '+this.index;
	}, function () {
		this.innerText = '';
		this.style.fontWeight = "normal";
	});	

// 3
var example_10_3 = switcher.items();

	example_10_3.addTabs('#exm10_tab_3 span', function () {
		this.classList.add('tab_active');
	}, function () {
		this.classList.remove('tab_active');
	});

	example_10_3.addBlocks('#exm10_block_3 span', function () {
		this.style.fontWeight = "bold";
		this.innerText = ': '+this.index;
	}, function () {
		this.innerText = '';
		this.style.fontWeight = "normal";
	});	


// 4
var example_10_4 = switcher.items({backClickTurnOff: true});

	example_10_4.addTabs('#exm10_tab_4 span', function () {
		this.classList.add('tab_active');
	}, function () {
		this.classList.remove('tab_active');
	});

	example_10_4.addBlocks('#exm10_block_4 span', function () {
		this.style.fontWeight = "bold";
		this.innerText = ': '+this.index;
	}, function () {
		this.innerText = '';
		this.style.fontWeight = "normal";
	});

// ===============


example_10_1.turnOn(0);
example_10_3.turnOn(3);

// addEnemies и addFriends - используются для 10 и 11 примера