'use strict';

class Ball {
	constructor(hex, type = 'b') {
		this.hex = hex;
		this.slot = 0;
		this.svgElement = null;
		this.type = type;
		this.lastTimeMoved = 0;
	}

	dump() {
		return {
			type: this.type
		};
	}

	static from(hex, json) {
		return new Ball(hex, json.type || 'b');
	}

	getDebugInfo() {
		return this.dump();
	}

	get hasMoved() {
		return this.lastTimeMoved === game.time;
	}

	moveTo(hex) {
		this.hex = hex;
		this.lastTimeMoved = game.time;
	}

	draw(slot = 0) {
		const isNew = this.svgElement === null && slot !== null;

		if (this.svgElement === null) {
			this.svgElement = svgBallLayer.group();


			this.fillSvgElement(this.svgElement);

			this.svgElement.center(...this.hex.getSlotCenter(slot));
			this.svgElement.click(() => this.hex.factory.onClick());
		}

		this.svgElement.back();

		if (isNew) {
			this.svgElement.transform({ scale: 0.01 }).animate({ duration: game.animationDuration }).transform({ scale: 1 });
		}
		else {
			let anim = this.svgElement.animate({ duration: game.animationDuration }).center(...this.hex.getSlotCenter(slot));
			if (slot === null) {
				anim = anim.transform({ scale: 0.6, origin: 'center center' }).after(() => { this.svgElement.remove(); this.erase(); });
			}
		}

	}

	erase() {
		if (this.svgElement !== null) {
			this.svgElement.remove();
			this.svgElement = null;
		}
	}

	fillSvgElement(g) {
		g.addClass('ball');
		let c;
		const bg = { '1': '#5d9cec', '2': '#4fc1e9', '3': '#fc6e51', '4': '#a0d468', '5': '#ffce54' };
		const fg = { '1': '#4a89dc', '2': '#3bafda', '3': '#e9573f', '4': '#8cc152', '5': '#f6bb42' };
		
		c = this.type[0]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']});
		c = this.type[1]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']}).transform({ translate: [8, -13.6] });
		c = this.type[2]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']}).transform({ translate: [16, 0] });
		c = this.type[3]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']}).transform({ translate: [8, 13.6] });
		c = this.type[4]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']}).transform({ translate: [-8, 13.6] });
		c = this.type[5]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']}).transform({ translate: [-16, 0] });
		c = this.type[6]; if (c && c !== '_') g.circle(16).fill(bg[c] || bg['1']).stroke({ width: 3, color: fg[c] || fg['1']}).transform({ translate: [-8, -13.6] });

	}
}
'use strict';

class Board {
	//
	//   5 0
	//  4 6 1
	//   3 2
	//
	constructor(json = null) {
		this.hexes = [
			new Hex(0, 0, 0),
			new Hex(1, 1, -1),
			new Hex(2, 2, 0),
			new Hex(3, 1, 1),
			new Hex(4, -1, 1),
			new Hex(5, -2, 0),
			new Hex(6, -1, -1),
			new Hex(7, 0, -2),
			new Hex(8, 2, -2),
			new Hex(9, 3, -1),
			new Hex(10, 4, 0),
			new Hex(11, 3, 1),
			new Hex(12, 2, 2),
			new Hex(13, 0, 2),
			new Hex(14, -2, 2),
			new Hex(15, -3, 1),
			new Hex(16, -4, 0),
			new Hex(17, -3, -1),
			new Hex(18, -2, -2),
		];

		this.hexes[0].link(0, this.hexes[1]);
		this.hexes[0].link(1, this.hexes[2]);
		this.hexes[0].link(2, this.hexes[3]);
		this.hexes[0].link(3, this.hexes[4]);
		this.hexes[0].link(4, this.hexes[5]);
		this.hexes[0].link(5, this.hexes[6]);

		this.hexes[1].link(2, this.hexes[2]);
		this.hexes[2].link(3, this.hexes[3]);
		this.hexes[3].link(4, this.hexes[4]);
		this.hexes[4].link(5, this.hexes[5]);
		this.hexes[5].link(0, this.hexes[6]);
		this.hexes[6].link(1, this.hexes[1]);

		this.hexes[1].link(5, this.hexes[7]); this.hexes[1].link(0, this.hexes[8]); this.hexes[1].link(1, this.hexes[9]);
		this.hexes[2].link(0, this.hexes[9]); this.hexes[2].link(1, this.hexes[10]); this.hexes[2].link(2, this.hexes[11]);
		this.hexes[3].link(1, this.hexes[11]); this.hexes[3].link(2, this.hexes[12]); this.hexes[3].link(3, this.hexes[13]);
		this.hexes[4].link(2, this.hexes[13]); this.hexes[4].link(3, this.hexes[14]); this.hexes[4].link(4, this.hexes[15]);
		this.hexes[5].link(3, this.hexes[15]); this.hexes[5].link(4, this.hexes[16]); this.hexes[5].link(5, this.hexes[17]);
		this.hexes[6].link(4, this.hexes[17]); this.hexes[6].link(5, this.hexes[18]); this.hexes[6].link(0, this.hexes[7]);

		this.hexes[7].link(1, this.hexes[8]);
		this.hexes[8].link(2, this.hexes[9]);
		this.hexes[9].link(2, this.hexes[10]);
		this.hexes[10].link(3, this.hexes[11]);
		this.hexes[11].link(3, this.hexes[12]);
		this.hexes[12].link(4, this.hexes[13]);
		this.hexes[13].link(4, this.hexes[14]);
		this.hexes[14].link(5, this.hexes[15]);
		this.hexes[15].link(5, this.hexes[16]);
		this.hexes[16].link(0, this.hexes[17]);
		this.hexes[17].link(0, this.hexes[18]);
		this.hexes[18].link(1, this.hexes[7]);

		if (json !== null) {
			for (let i = 0; i < json.hexes.length; i++) {
				this.hexes[i].load(json.hexes[i]);
			}
		}
	}

	dump() {
		return {
			hexes: this.hexes.map(x => x.dump())
		};
	}

	get ballTypes() { return this.hexes.map(x => x.balls.map(x => x.type)); }

	draw() {
		this.hexes.forEach(x => x.draw());
	}

	tick() {
		this.hexes.forEach(x => x.prepareTick());
		for (let step = 0; ; step++) {
			this.hexes.forEach(x => x.prepareMoves());
			this.hexes.forEach(x => x.detectCycles());
			let resolved = false;
			let i = 0;
			while (!resolved) {
				resolved = true;
				this.hexes.forEach(x => { if (!x.resolveMoves()) resolved = false; });
				if (i++ > 100) { console.error('Cannot resolve move!'); break; }
			}

			if (!this.hexes.some(x => x.changed)) break;
			if (step > 50) { console.error('Cannot finish tick!'); break; }
		} 
	}
}
'use strict';

class Game {
	constructor(json = null) {
		this.isPaused = false;
		this.timeout = null;

		if (json === null) json = {}

		this.board = new Board(json.board || { hexes: [{ factory: { type: 'GeneratorFactory' } }] });
		this.delay = json.delay || 1000;
		this.time = 0;
	}

	dump() {
		return {
			board: this.board.dump(),
			delay: this.delay
		};
	}

	save(key = 'game') {
		window.localStorage.setItem(key, JSON.stringify(this.dump()));
	}

	static load(key = 'game') {
		const json = JSON.parse(window.localStorage.getItem(key));
		return new Game(json);
	}

	get animationDuration() { return this.delay * 0.8; }
	get animationOptions() { return { duration: this.animationDuration }; }

	togglePaused() {
		this.isPaused = !this.isPaused;
		clearTimeout(this.timeout);
		if (!this.isPaused) this.go();
	}

	go() {
		this.board.draw();
		this.timeout = setTimeout(() => this.tick(), this.delay);
	}

	tick() {
		if (this.isPaused) return;
		this.time++;
		this.board.tick();
		this.save();
		this.go();
	}
}
'use strict';

class Hex {
	constructor(id, x, y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.links = [null, null, null, null, null, null];

		this.factory = new EmptyFactory(this);
		this.balls = [];
		this.incomingBallsRoundRobin = 0;

		this.hasIncomingBall = [false, false, false, false, false, false];
		this.isResolved = false;
		this.waitingForHexAtDirection = null;
		this.forcedIncomingDirectionDueToCycles = null;
		this.working = false;
		this.ballsToBeAbsorbed = [];
		this.countOutflow = 0;
		this.changed = false;
	}

	dump() {
		return {
			factory: this.factory.dump(),
			balls: this.balls.map(x => x.dump()),
			incomingBallsRoundRobin: this.incomingBallsRoundRobin,
		};
	}

	load(json) {
		if (json === null) json = { factory: { type: 'EmptyFactory' } };
		this.factory = Factory.from(this, json.factory);
		this.balls = (json.balls || []).map(x => Ball.from(this, x));
		this.incomingBallsRoundRobin = json.incomingBallsRoundRobin || 0;
	}

	getDebugInfo() {
		return {
			factory: this.factory.getDebugInfo(),
			balls: this.balls.map(x => x.getDebugInfo())
		}
	}

	draw() {
		this.factory.draw();
		this.balls.forEach((x, slot) => x.draw(slot));
		this.ballsToBeAbsorbed.forEach(x => x.draw(null));
		this.ballsToBeAbsorbed.length = 0;
	}

	//
	//
	// Geometry
	//
	//

	link(direction, hex) {
		this.links[direction] = hex;
		hex.links[this.getOppositeDirection(direction)] = this;
	}

	getLinkedHex(direction) {
		return this.links[direction] || null;
	}

	getOppositeDirection(direction) {
		return (direction + 3) % 6;
	}

	getCenter() {
		return [X0 + this.x * DX, Y0 + this.y * DY];
	}

	getSlotCenter(slot) {
		let x = X0 + this.x * DX;
		let y = Y0 + this.y * DY;
		if (slot !== null) {
			const DD = (this.balls.length - 1) * 2 - slot * 4;
			x += DD;
			y -= DD;
		}
		return [x, y];
	}

	////////////////////////////////////////////////////////////
	//                                                        //
	// Tick processing                                        //
	//                                                        //
	////////////////////////////////////////////////////////////

	prepareTick() {
		this.countOutflow = 0;
	}

	prepareMoves() {
		this.isResolved = false;
		this.isInCycle = null;
		this.changed = false;
		if (this.countOutflow < this.factory.getOutflowCapacity()) {
			this.factory.prepareMoves();
		}
	}

	detectCycles() {
		if (this.isInCycle !== null) return null;
		if (this.working) return this; // we have found the node that closes the circle!
		this.working = true;
		let circleNode = null;
		if (this.waitingForHexAtDirection !== null && this.factory.isSaturated()) {
			circleNode = this.links[this.waitingForHexAtDirection].detectCycles();
		}
		this.isInCycle = circleNode !== null;	
		if (this.isInCycle) {
			this.links[this.waitingForHexAtDirection].forcedIncomingDirectionDueToCycles = this.getOppositeDirection(this.waitingForHexAtDirection);
			this.waitingForHexAtDirection = null;
		}
		this.working = false;
		return circleNode === this ? null : circleNode; // we should not return the node that closes the circle the second time.
	}

	resolveMoves() {
		if (this.isResolved) return true;
		if (this.waitingForHexAtDirection !== null && this.factory.isSaturated()) return false;
		if (this.forcedIncomingDirectionDueToCycles !== null) {
			if (this.countOutflow < this.factory.getOutflowCapacity() || !this.factory.isSaturated()) {
				this.acceptIncomingBall(this.forcedIncomingDirectionDueToCycles);
				this.forcedIncomingDirectionDueToCycles = null;
			}
		}
		else {
			for (let i = 0; i < 6 && !this.factory.isSaturated(); i++) {
				this.acceptIncomingBall(this.incomingBallsRoundRobin);
				this.incomingBallsRoundRobin = (this.incomingBallsRoundRobin + 1) % 6;
			}
		}
		if (this.waitingForHexAtDirection === null) {
			this.rejectIncomingBalls();
			this.isResolved = true;
		}
		this.factory.onAfterResolvingMoves();
		return this.isResolved;
	}

	//
	//
	// Model methods
	//
	//

	proposeBallTransferTowards(direction) {
		if (this.balls.length === 0) return false;
		if (this.balls[0].hasMoved) return false;
		const hex = this.getLinkedHex(direction);
		if (hex === null) return false;
		if (!hex.factory.couldAcceptBall(this.balls[0])) return false;
		hex.hasIncomingBall[this.getOppositeDirection(direction)] = true;
		this.waitingForHexAtDirection = direction;
		return true;
	}

	rejectIncomingBalls() {
		for (let i = 0; i < 6; i++) {
			if (this.hasIncomingBall[i]) {
				this.links[i].waitingForHexAtDirection = null;
				this.hasIncomingBall[i] = false;
			}
		}
	}

	acceptIncomingBall(direction) {
		if (this.hasIncomingBall[direction]) {
			this.acceptBall(this.links[direction].ejectOutgoingBall());
			this.hasIncomingBall[direction] = false;
		}
	}

	ejectOutgoingBall() {
		if (this.balls.length === 0) return null;
		const ball = this.balls[0];
		this.countOutflow++;
		this.balls.shift();
		this.waitingForHexAtDirection = null;
		this.changed = true;
		return ball;
	}

	acceptBall(ball) {
		if (ball === null) return null;
		ball.moveTo(this);
		this.balls.push(ball);
		this.changed = true;
		return ball;
	}

	absorbBall(ball) {
		this.ballsToBeAbsorbed.push(ball);
	}
}
'use strict';

class Factory {
	constructor(hex) {
		this.hex = hex;
		this.svgElement = null;
	}

	dump() {
		return {
			type: this.constructor.name
		}
	}

	static from(hex, json) {
		if (json === null) json = { type: 'EmptyFactory' };

		switch (json.type) {
			default:
			case 'EmptyFactory': return new EmptyFactory(hex);
			case 'BeltFactory': return BeltFactory.from(hex, json);
			case 'BufferFactory': return BufferFactory.from(hex, json);
			case 'GeneratorFactory': return GeneratorFactory.from(hex, json);
			case 'BuilderFactory': return BuilderFactory.from(hex, json);
		}
	}

	getDebugInfo() {
		return this.dump();
	}


	//
	//
	// Properties
	//
	//
	getDirection() { return 1; }
	getRequiredBallsToBuild() { return 0; }
	getTitle() { return 'Factory' }
	getOutflowCapacity() { return 0; }


	//
	//
	// Model events
	//
	//
	prepareMoves() { return false; }
	onAfterResolvingMoves() { }
	couldAcceptBall(ball) { return false; }
	isSaturated() { return true; }



	//
	//
	// Drawing & UI
	//
	//

	fillSvgElement(g) {
		g.path('M137.956,123.378 L88.178,152.178 C85.861,153.399 82.704,154.074 79.902,154.074 C77.099,154.074 74.139,153.399 71.822,152.178 L21.333,123.378 C19.115,121.986 17.022,119.459 15.621,117.037 C14.220,114.615 13.099,111.613 13.000,109.000 L13.000,51.000 C13.099,48.387 14.220,45.385 15.621,42.963 C16.943,40.678 18.917,38.704 20.978,37.333 L72.889,7.822 C75.064,6.781 77.328,5.926 79.902,5.926 C82.704,5.926 85.150,6.601 87.467,7.822 L138.311,37.333 C140.529,38.725 142.426,40.541 143.827,42.963 C145.228,45.385 146.901,48.387 147.000,51.000 L147.000,108.000 C146.901,110.613 145.228,114.615 143.827,117.037 C142.426,119.459 140.174,121.986 137.956,123.378 Z')
			.addClass('factory-border');
		g.path('M131.900,118.656 L87.323,144.320 C85.249,145.409 82.422,146.010 79.912,146.010 C77.402,146.010 74.751,145.409 72.677,144.320 L27.463,118.656 C25.476,117.415 23.602,115.163 22.347,113.005 C21.092,110.847 20.088,108.171 20.000,105.843 L20.000,54.157 C20.088,51.828 21.092,49.153 22.347,46.995 C23.531,44.959 25.299,43.199 27.144,41.978 L73.632,15.680 C75.580,14.751 77.607,13.990 79.912,13.990 C82.422,13.990 84.612,14.591 86.687,15.680 L132.219,41.978 C134.205,43.218 135.904,44.837 137.159,46.995 C138.413,49.153 139.912,51.828 140.000,54.157 L140.000,104.952 C139.912,107.280 138.413,110.847 137.159,113.005 C135.904,115.163 133.887,117.415 131.900,118.656 Z')
			.addClass('factory-background');
	}

	getSvgRotation() {
		switch (this.getDirection()) {
			default:
			case 0: return 300;
			case 1: return 0;
			case 2: return 60;
			case 3: return 120;
			case 4: return 180;
			case 5: return 240;
		}
	}

	draw() {
		if (this.svgElement === null) {
			this.svgElement = svgFactoryLayer.group().addClass('factory');
			this.fillSvgElement(this.svgElement);

			this.svgElement.center(X0 + this.hex.x * DX, Y0 + this.hex.y * DY);
			this.svgElement.transform({ rotate: this.getSvgRotation() });
			this.svgElement.click(() => { this.onClick(); });
		}
		this.svgElement.animate({ duration: game.animationDuration }).transform({ rotate: this.getSvgRotation() });
	}

	erase() {
		if (this.svgElement !== null) {
			this.svgElement.remove();
			this.svgElement = null;
		}
	}

	onDestroy() {
		this.erase();
		this.hex.balls.forEach(x => x.erase());
		this.hex.balls.length = 0;
		this.hex.factory = new EmptyFactory(this.hex);
		this.hex.draw();
		this.hex.factory.onClick();
	}

	fillMenu() { }

	onClick() {
		this.clearSelection();

		this.svgElement.addClass('selected');

		svgMenuLayer.text(this.getTitle()).addClass('factory-title')
			.font({ family: 'Helvetica, sans-serif', size: 144, color: '#434a54' })
			.center(X0, 0);

		this.fillMenu();
	}

	onBuild(factory) {
		this.erase();
		this.hex.factory = new BuilderFactory(this.hex, factory);
		this.hex.draw();
		this.hex.factory.onClick();
	}

	clearSelection() {
		svg.find('.factory').removeClass('selected');
		svgMenuLayer.clear();
	}
}
'use strict';

class BeltFactory extends Factory {
	constructor(hex, direction = 1, outflow = 1) {
		super(hex);
		this.direction = direction;
		this.outflow = outflow;
	}

	dump() {
		return {
			...super.dump(),
			direction: this.direction,
			outflow: this.outflow
		};
	}

	static from(hex, json) {
		let x;
		const direction = [0, 1, 2, 3, 4, 5].includes(x = parseInt(json.direction)) ? x : 1;
		const outflow = Number.isInteger(x = parseInt(json.outflow)) ? Math.max(1, x) : 1;
		return new BeltFactory(hex, direction, outflow)
	}

	getTitle() { return 'Belt'; }
	getRequiredBallsToBuild() { return Math.pow(10, this.outflow); }
	getDirection() { return this.direction; }
	getOutflowCapacity() { return this.outflow; }

	fillSvgElement(g) {
		super.fillSvgElement(g);
		g.path('M120.000,88.000 L120.000,72.000 L134.000,80.000 L120.000,88.000 Z')
			.fill('#8cc152');
		g.path('M122.000,84.000 L122.000,76.000 L129.000,80.000 L122.000,84.000 Z')
			.fill('#a0d468');
	}

	prepareMoves() {
		return this.hex.proposeBallTransferTowards(this.direction);
	}

	couldAcceptBall(ball) {
		return ball.hex !== this.hex.getLinkedHex(this.direction);
	}

	isSaturated() {
		return this.hex.balls.length >= this.outflow;
	}

	onRotate(delta) {
		this.direction = (6 + this.direction + delta) % 6;
		this.draw();
	}

	fillMenu() {
		var b;

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54').center(X0 + 100, 60);
		b.path('M33.368,28.561 C36.006,28.748 38.348,29.870 40.004,31.563 C39.735,31.553 39.472,31.526 39.201,31.526 C34.092,31.526 29.455,33.297 25.939,36.177 C25.659,36.435 25.374,36.687 25.076,36.931 C24.735,37.245 24.390,37.556 24.075,37.893 C24.122,37.786 24.182,37.685 24.231,37.579 C24.043,37.717 23.872,37.872 23.678,38.004 C26.978,33.646 28.249,28.048 26.630,22.530 C26.558,22.283 26.458,22.051 26.376,21.809 C28.676,22.860 30.533,24.691 31.442,27.040 C31.270,27.744 31.039,28.431 30.782,29.108 C32.663,25.239 33.151,20.781 31.771,16.394 C29.253,8.391 22.486,4.251 14.264,4.443 L13.196,0.802 C23.483,-1.280 33.327,2.542 36.292,11.965 C38.249,18.187 36.487,24.557 32.236,29.157 C32.608,28.951 32.980,28.745 33.368,28.561 ZM9.911,6.491 C7.809,7.975 6.126,9.765 4.850,11.729 C5.597,8.521 7.247,6.093 9.787,3.859 C5.962,3.455 2.849,2.369 0.011,0.006 C2.302,0.923 4.811,1.483 7.467,1.571 C9.393,1.634 11.344,1.178 13.131,0.582 L14.285,4.516 C12.735,4.967 11.198,5.583 9.911,6.491 Z')
			.fill('#444545').center(X0 + 100, 60);
		b.click(() => this.onRotate(1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54').center(X0 - 100, 60);
		b.path('M30.213,3.859 C32.753,6.093 34.403,8.521 35.150,11.729 C33.874,9.765 32.191,7.975 30.089,6.491 C28.802,5.583 27.265,4.967 25.715,4.516 L26.869,0.582 C28.656,1.178 30.607,1.634 32.533,1.571 C35.189,1.483 37.698,0.923 39.989,0.006 C37.151,2.369 34.038,3.455 30.213,3.859 ZM8.229,16.394 C6.849,20.781 7.337,25.239 9.218,29.108 C8.961,28.431 8.730,27.744 8.558,27.040 C9.467,24.691 11.324,22.860 13.624,21.809 C13.542,22.051 13.442,22.283 13.370,22.530 C11.751,28.048 13.022,33.646 16.322,38.004 C16.128,37.872 15.957,37.717 15.769,37.579 C15.818,37.685 15.878,37.786 15.925,37.893 C15.610,37.556 15.265,37.245 14.924,36.931 C14.626,36.687 14.341,36.435 14.061,36.177 C10.545,33.297 5.908,31.526 0.799,31.526 C0.528,31.526 0.265,31.553 -0.004,31.563 C1.652,29.870 3.994,28.748 6.632,28.561 C7.020,28.745 7.392,28.951 7.764,29.157 C3.513,24.557 1.751,18.187 3.708,11.965 C6.673,2.542 16.517,-1.280 26.804,0.802 L25.736,4.443 C17.514,4.251 10.747,8.391 8.229,16.394 Z')
			.fill('#444545').center(X0 - 100, 60);
		b.click(() => this.onRotate(-1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Destroy').center(50, 30);
		b.center(X0 + 250, 60);
		b.click(() => this.onDestroy());

		let f = new BeltFactory(this.hex, this.direction, this.outflow + 1);
		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Upgrade').center(50, 20);
		b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
		b.center(X0 + 400, 60);
		b.click(() => this.onBuild(f));

	}
}
'use strict';

class BufferFactory extends Factory {
	constructor(hex, direction = 1, capacity = 10, outflow = 1) {
		super(hex);
		this.direction = direction;
		this.capacity = capacity;
		this.ballsInBuffer = [];
		this.outflow = outflow;
	}

	dump() {
		return {
			...super.dump(),
			direction: this.direction,
			capacity: this.capacity,
			outflow: this.outflow,
			ballsInBuffer: this.ballsInBuffer.map(x => x.dump())
		};
	}

	static from(hex, json) {
		let x;
		const direction = [0, 1, 2, 3, 4, 5].includes(x = parseInt(json.direction)) ? x : 1;
		const capacity = Number.isInteger(x = parseInt(json.capacity)) ? Math.max(0, x) : 10;
		const outflow = Number.isInteger(x = parseInt(json.outflow)) ? Math.max(1, x) : 1;
		const r = new BufferFactory(hex, direction, capacity, outflow);
		r.ballsInBuffer = (json.ballsInBuffer || []).map(j => Ball.from(hex, j));
		return r;
	}

	getTitle() { return 'Buffer'; }
	getRequiredBallsToBuild() { return Math.floor(Math.pow(this.capacity, 1.7)) + Math.pow(10, this.outflow); }
	getDirection() { return this.direction; }
	getOutflowCapacity() { return this.outflow; }

	fillSvgElement(g) {
		super.fillSvgElement(g);
		g.path('M120.000,88.000 L120.000,72.000 L134.000,80.000 L120.000,88.000 Z')
			.fill('#8c0000');
		g.path('M122.000,84.000 L122.000,76.000 L129.000,80.000 L122.000,84.000 Z')
			.fill('#a00000');
	}

	prepareMoves() {
		return this.hex.proposeBallTransferTowards(this.direction);
	}

	couldAcceptBall(ball) {
		return ball.hex !== this.hex.getLinkedHex(this.direction);
	}

	isSaturated() {
		return this.hex.balls.length + this.ballsInBuffer.length >= this.outflow + this.capacity;
	}

	onAfterResolvingMoves() {
		while (this.ballsInBuffer.length > 0 && this.hex.balls.length < this.outflow) {
			this.hex.balls.push(this.ballsInBuffer.shift());
		}
		if (this.hex.balls.length > this.outflow) {
			for (let i = this.outflow; i < this.hex.balls.length; i++) {
				this.ballsInBuffer.push(this.hex.balls[i]);
				this.hex.absorbBall(this.hex.balls[i]);
			}
			this.hex.balls.length = this.outflow;
		}
	}

	onRotate(delta) {
		this.direction = (6 + this.direction + delta) % 6;
		this.draw();
	}

	fillMenu() {
		var b;
		let f;

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54').center(X0 + 100, 60);
		b.path('M33.368,28.561 C36.006,28.748 38.348,29.870 40.004,31.563 C39.735,31.553 39.472,31.526 39.201,31.526 C34.092,31.526 29.455,33.297 25.939,36.177 C25.659,36.435 25.374,36.687 25.076,36.931 C24.735,37.245 24.390,37.556 24.075,37.893 C24.122,37.786 24.182,37.685 24.231,37.579 C24.043,37.717 23.872,37.872 23.678,38.004 C26.978,33.646 28.249,28.048 26.630,22.530 C26.558,22.283 26.458,22.051 26.376,21.809 C28.676,22.860 30.533,24.691 31.442,27.040 C31.270,27.744 31.039,28.431 30.782,29.108 C32.663,25.239 33.151,20.781 31.771,16.394 C29.253,8.391 22.486,4.251 14.264,4.443 L13.196,0.802 C23.483,-1.280 33.327,2.542 36.292,11.965 C38.249,18.187 36.487,24.557 32.236,29.157 C32.608,28.951 32.980,28.745 33.368,28.561 ZM9.911,6.491 C7.809,7.975 6.126,9.765 4.850,11.729 C5.597,8.521 7.247,6.093 9.787,3.859 C5.962,3.455 2.849,2.369 0.011,0.006 C2.302,0.923 4.811,1.483 7.467,1.571 C9.393,1.634 11.344,1.178 13.131,0.582 L14.285,4.516 C12.735,4.967 11.198,5.583 9.911,6.491 Z')
			.fill('#444545').center(X0 + 100, 60);
		b.click(() => this.onRotate(1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54').center(X0 - 100, 60);
		b.path('M30.213,3.859 C32.753,6.093 34.403,8.521 35.150,11.729 C33.874,9.765 32.191,7.975 30.089,6.491 C28.802,5.583 27.265,4.967 25.715,4.516 L26.869,0.582 C28.656,1.178 30.607,1.634 32.533,1.571 C35.189,1.483 37.698,0.923 39.989,0.006 C37.151,2.369 34.038,3.455 30.213,3.859 ZM8.229,16.394 C6.849,20.781 7.337,25.239 9.218,29.108 C8.961,28.431 8.730,27.744 8.558,27.040 C9.467,24.691 11.324,22.860 13.624,21.809 C13.542,22.051 13.442,22.283 13.370,22.530 C11.751,28.048 13.022,33.646 16.322,38.004 C16.128,37.872 15.957,37.717 15.769,37.579 C15.818,37.685 15.878,37.786 15.925,37.893 C15.610,37.556 15.265,37.245 14.924,36.931 C14.626,36.687 14.341,36.435 14.061,36.177 C10.545,33.297 5.908,31.526 0.799,31.526 C0.528,31.526 0.265,31.553 -0.004,31.563 C1.652,29.870 3.994,28.748 6.632,28.561 C7.020,28.745 7.392,28.951 7.764,29.157 C3.513,24.557 1.751,18.187 3.708,11.965 C6.673,2.542 16.517,-1.280 26.804,0.802 L25.736,4.443 C17.514,4.251 10.747,8.391 8.229,16.394 Z')
			.fill('#444545').center(X0 - 100, 60);
		b.click(() => this.onRotate(-1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Destroy').center(50, 30);
		b.center(X0 + 250, 60);
		b.click(() => this.onDestroy());

		{
			const f = new BufferFactory(this.hex, this.direction, this.capacity, this.outflow + 1);
			f.ballsInBuffer = this.ballsInBuffer
			b = svgMenuLayer.group();
			b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
			b.text('Upgrade').center(50, 20);
			b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
			b.center(X0 + 400, 60);
			b.click(() => this.onBuild(f));
		}

		{
			const f = new BufferFactory(this.hex, this.direction, this.capacity * 2, this.outflow);
			f.ballsInBuffer = this.ballsInBuffer
			b = svgMenuLayer.group();
			b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
			b.text('Increase capacity').center(50, 20);
			b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
			b.center(X0 + 400, 120);
			b.click(() => this.onBuild(f));
		}
	}
}
'use strict';

class BuilderFactory extends Factory {
	constructor(hex, target) {
		super(hex);
		this.target = target;
		this.countBalls = 0;
		this.svgProgress = null;
	}

	dump() {
		return {
			...super.dump(),
			target: this.target.dump(),
			countBalls: this.countBalls
		};
	}

	static from(hex, json) {
		const r = new BuilderFactory(hex, Factory.from(hex, json.target));
		r.countBalls = json.countBalls || 0;
		return r;
	}

	getTitle() { return 'Building ' + this.target.getTitle(); }
	getPercentage() { return this.countBalls / this.target.getRequiredBallsToBuild(); }
	getOutflowCapacity() { return 0; }

	fillSvgElement(g) {
		super.fillSvgElement(g);
		g.path('M70.611,143.148 L56.203,134.970 L140.000,86.590 L140.000,103.087 L70.611,143.148 ZM27.463,118.656 C27.440,118.641 27.418,118.623 27.395,118.609 L139.943,53.629 C139.964,53.806 139.993,53.984 140.000,54.157 L140.000,70.093 L41.795,126.791 L27.463,118.656 ZM20.000,105.843 L20.000,89.885 L117.601,33.535 L131.884,41.785 L20.063,106.345 C20.049,106.179 20.006,106.005 20.000,105.843 ZM20.000,56.891 L89.033,17.035 L103.317,25.285 L20.000,73.388 L20.000,56.891 Z')
			.fill('#f6bb42');
		g.path('M68.865,142.157 L57.950,135.961 L140.000,88.590 L140.000,101.087 L68.865,142.157 ZM29.134,119.605 L140.000,55.596 L140.000,68.093 L40.049,125.800 L29.134,119.605 ZM20.000,91.885 L119.332,34.535 L130.153,40.785 L20.000,104.381 L20.000,91.885 ZM20.000,58.891 L90.765,18.035 L101.585,24.285 L20.000,71.388 L20.000,58.891 Z')
			.fill('#ffce54');
		g.path('M113.500,114.000 L46.500,114.000 C44.015,114.000 42.000,111.985 42.000,109.500 C42.000,107.015 44.015,105.000 46.500,105.000 L113.500,105.000 C115.985,105.000 118.000,107.015 118.000,109.500 C118.000,111.985 115.985,114.000 113.500,114.000 Z')
			.fill('#656d78');
		g.path('M113.500, 113.000 L46.500, 113.000 C44.567, 113.000 43.000, 111.433 43.000, 109.500 C43.000, 107.567 44.567, 106.000 46.500, 106.000 L113.500, 106.000 C115.433, 106.000 117.000, 107.567 117.000, 109.500 C117.000, 111.433 115.433, 113.000 113.500, 113.000 Z')
			.fill('#8cc152')
			.clipWith(svg.rect(74, 80).fill('#ffffff').center(X0 + this.hex.x * DX, Y0 + this.hex.y * DY))
			.attr({ 'class': 'progress' });
	}

	couldAcceptBall() {
		return true;
	}

	isSaturated() {
		return this.hex.balls.length + this.countBalls >= this.target.getRequiredBallsToBuild();
	}

	draw() {
		super.draw();
		this.svgElement.find('.progress').clipper().animate({ duration: game.animationDuration }).transform({ scaleX: this.getPercentage(), origin: 'left' });
	}

	fillMenu() {
		var b;

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Destroy').center(50, 30);
		b.center(X0 + 250, 60);
		b.click(() => this.onDestroy());
	}

	onAfterResolvingMoves() {
		this.hex.balls.forEach(x => {
			this.countBalls++;
			this.hex.absorbBall(x);
		});
		this.hex.balls.length = 0;
		if (this.countBalls === this.target.getRequiredBallsToBuild()) {
			this.erase();
			this.hex.factory = this.target;
			this.hex.countOutflow = this.target.getOutflowCapacity();
		}
	}
}



'use strict';

class EmptyFactory extends Factory {
	constructor(hex) { super(hex); }
	getTitle() { return 'Empty space'; }

	getOutflowCapacity() { return 0; }
	couldAcceptBall(ball) { return false; }
	isSaturated() { return true; }

	fillMenu() {
		let b;

		{
			const f = new BeltFactory(this.hex);
			b = svgMenuLayer.group();
			b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
			b.text('Belt').center(50, 20);
			b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
			b.center(X0 - 250, 60);
			b.click(() => this.onBuild(f));
		}

		{
			const f = new BufferFactory(this.hex);
			b = svgMenuLayer.group();
			b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
			b.text('Buffer').center(50, 20);
			b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
			b.center(X0 - 100, 60);
			b.click(() => this.onBuild(f));
		}

		{
			const f = new GeneratorFactory(this.hex);
			b = svgMenuLayer.group();
			b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
			b.text('Generator').center(50, 20);
			b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
			b.center(X0 + 50, 60);
			b.click(() => this.onBuild(f));
		}
	}
}

'use strict';

class GeneratorFactory extends Factory {
	constructor(hex, direction = 1, outflow = 1) {
		super(hex);
		this.direction = direction;
		this.outflow = outflow;
	}

	dump() {
		return {
			...super.dump(),
			direction: this.direction,
			outflow: this.outflow
		};
	}

	static from(hex, json) {
		let x;
		const direction = [0, 1, 2, 3, 4, 5].includes(x = parseInt(json.direction)) ? x : 1;
		const outflow = Number.isInteger(x = parseInt(json.outflow)) ? Math.max(1, x) : 1;
		return new GeneratorFactory(hex, direction, outflow)
	}

	getTitle() { return 'Generator'; }
	getRequiredBallsToBuild() { return Math.pow(10, 1 + this.outflow); }
	getDirection() { return this.direction; }
	getOutflowCapacity() { return this.outflow; }


	fillSvgElement(g) {
		super.fillSvgElement(g);
		g.path('M122.085,87.002 C118.743,107.233 101.178,122.667 80.000,122.667 C56.436,122.667 37.333,103.564 37.333,80.000 C37.333,56.436 56.436,37.333 80.000,37.333 C101.177,37.333 118.742,52.766 122.085,72.996 L134.267,79.999 L122.085,87.002 ZM80.333,43.289 C59.874,43.289 43.289,59.874 43.289,80.333 C43.289,100.792 59.874,117.378 80.333,117.378 C100.792,117.378 117.378,100.792 117.378,80.333 C117.378,59.874 100.792,43.289 80.333,43.289 Z')
			.fill('#da4453');
		g.path('M120.738,84.590 C118.455,105.072 101.091,121.000 80.000,121.000 C57.356,121.000 39.000,102.644 39.000,80.000 C39.000,57.356 57.356,39.000 80.000,39.000 C101.091,39.000 118.455,54.928 120.738,75.410 L129.000,80.000 L120.738,84.590 ZM80.000,41.000 C58.461,41.000 41.000,58.461 41.000,80.000 C41.000,101.539 58.461,119.000 80.000,119.000 C101.539,119.000 119.000,101.539 119.000,80.000 C119.000,58.461 101.539,41.000 80.000,41.000 Z')
			.fill('#ed5565');
	}

	couldAcceptBall() { return false; }
	isSaturated() { return this.hex.balls.length >= this.outflow; }

	prepareMoves() {
		return this.hex.proposeBallTransferTowards(this.direction);
	}

	onAfterResolvingMoves() {
		if (!this.isSaturated()) {
			let type = '' + (1 + Math.floor(Math.random() * 5));
			this.hex.acceptBall(new Ball(null, type));
		}
	}

	onRotate(delta) {
		this.direction = (6 + this.direction + delta) % 6;
		this.draw();
	}

	fillMenu() {
		var b;

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.path('M33.368,28.561 C36.006,28.748 38.348,29.870 40.004,31.563 C39.735,31.553 39.472,31.526 39.201,31.526 C34.092,31.526 29.455,33.297 25.939,36.177 C25.659,36.435 25.374,36.687 25.076,36.931 C24.735,37.245 24.390,37.556 24.075,37.893 C24.122,37.786 24.182,37.685 24.231,37.579 C24.043,37.717 23.872,37.872 23.678,38.004 C26.978,33.646 28.249,28.048 26.630,22.530 C26.558,22.283 26.458,22.051 26.376,21.809 C28.676,22.860 30.533,24.691 31.442,27.040 C31.270,27.744 31.039,28.431 30.782,29.108 C32.663,25.239 33.151,20.781 31.771,16.394 C29.253,8.391 22.486,4.251 14.264,4.443 L13.196,0.802 C23.483,-1.280 33.327,2.542 36.292,11.965 C38.249,18.187 36.487,24.557 32.236,29.157 C32.608,28.951 32.980,28.745 33.368,28.561 ZM9.911,6.491 C7.809,7.975 6.126,9.765 4.850,11.729 C5.597,8.521 7.247,6.093 9.787,3.859 C5.962,3.455 2.849,2.369 0.011,0.006 C2.302,0.923 4.811,1.483 7.467,1.571 C9.393,1.634 11.344,1.178 13.131,0.582 L14.285,4.516 C12.735,4.967 11.198,5.583 9.911,6.491 Z')
			.fill('#444545').center(50, 30);
		b.center(X0 + 100, 60);
		b.click(() => this.onRotate(1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.path('M30.213,3.859 C32.753,6.093 34.403,8.521 35.150,11.729 C33.874,9.765 32.191,7.975 30.089,6.491 C28.802,5.583 27.265,4.967 25.715,4.516 L26.869,0.582 C28.656,1.178 30.607,1.634 32.533,1.571 C35.189,1.483 37.698,0.923 39.989,0.006 C37.151,2.369 34.038,3.455 30.213,3.859 ZM8.229,16.394 C6.849,20.781 7.337,25.239 9.218,29.108 C8.961,28.431 8.730,27.744 8.558,27.040 C9.467,24.691 11.324,22.860 13.624,21.809 C13.542,22.051 13.442,22.283 13.370,22.530 C11.751,28.048 13.022,33.646 16.322,38.004 C16.128,37.872 15.957,37.717 15.769,37.579 C15.818,37.685 15.878,37.786 15.925,37.893 C15.610,37.556 15.265,37.245 14.924,36.931 C14.626,36.687 14.341,36.435 14.061,36.177 C10.545,33.297 5.908,31.526 0.799,31.526 C0.528,31.526 0.265,31.553 -0.004,31.563 C1.652,29.870 3.994,28.748 6.632,28.561 C7.020,28.745 7.392,28.951 7.764,29.157 C3.513,24.557 1.751,18.187 3.708,11.965 C6.673,2.542 16.517,-1.280 26.804,0.802 L25.736,4.443 C17.514,4.251 10.747,8.391 8.229,16.394 Z')
			.fill('#444545').center(50, 30);
		b.center(X0 - 100, 60);
		b.click(() => this.onRotate(-1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Destroy').center(50, 30);
		b.center(X0 + 250, 60);
		b.click(() => this.onDestroy());

		{
			const f = new GeneratorFactory(this.hex, this.direction, this.outflow + 1);
			b = svgMenuLayer.group();
			b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
			b.text('Upgrade').center(50, 20);
			b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
			b.center(X0 + 400, 60);
			b.click(() => this.onBuild(f));
		}
	}
}
'use strict';

class MixerFactory extends Factory {
	constructor(hex, direction = 1, outflow = 1, recipe = '11') {
		super(hex);
		this.direction = direction;
		this.outflow = outflow;
		this.recipe = recipe;
	}

	dump() {
		return {
			...super.dump(),
			direction: this.direction,
			outflow: this.outflow,
			recipe: recipe
		};
	}

	static from(hex, json) {
		let x;
		const direction = [0, 1, 2, 3, 4, 5].includes(x = parseInt(json.direction)) ? x : 1;
		const outflow = Number.isInteger(x = parseInt(json.outflow)) ? Math.max(1, x) : 1;
		const recipe = json.recipe || '11';
		return new BeltFactory(hex, direction, outflow, recipe);
	}

	getTitle() { return 'Belt'; }
	getRequiredBallsToBuild() { return Math.pow(10, this.outflow); }
	getDirection() { return this.direction; }
	getOutflowCapacity() { return this.outflow; }

	fillSvgElement(g) {
		super.fillSvgElement(g);
		g.path('M120.000,88.000 L120.000,72.000 L134.000,80.000 L120.000,88.000 Z')
			.fill('#8cc152');
		g.path('M122.000,84.000 L122.000,76.000 L129.000,80.000 L122.000,84.000 Z')
			.fill('#a0d468');
	}

	prepareMoves() {
		return this.hex.proposeBallTransferTowards(this.direction);
	}

	couldAcceptBall(ball) {
		return ball.hex !== this.hex.getLinkedHex(this.direction);
	}

	isSaturated() {
		return this.hex.balls.length >= this.outflow;
	}

	onRotate(delta) {
		this.direction = (6 + this.direction + delta) % 6;
		this.draw();
	}

	fillMenu() {
		var b;

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54').center(X0 + 100, 60);
		b.path('M33.368,28.561 C36.006,28.748 38.348,29.870 40.004,31.563 C39.735,31.553 39.472,31.526 39.201,31.526 C34.092,31.526 29.455,33.297 25.939,36.177 C25.659,36.435 25.374,36.687 25.076,36.931 C24.735,37.245 24.390,37.556 24.075,37.893 C24.122,37.786 24.182,37.685 24.231,37.579 C24.043,37.717 23.872,37.872 23.678,38.004 C26.978,33.646 28.249,28.048 26.630,22.530 C26.558,22.283 26.458,22.051 26.376,21.809 C28.676,22.860 30.533,24.691 31.442,27.040 C31.270,27.744 31.039,28.431 30.782,29.108 C32.663,25.239 33.151,20.781 31.771,16.394 C29.253,8.391 22.486,4.251 14.264,4.443 L13.196,0.802 C23.483,-1.280 33.327,2.542 36.292,11.965 C38.249,18.187 36.487,24.557 32.236,29.157 C32.608,28.951 32.980,28.745 33.368,28.561 ZM9.911,6.491 C7.809,7.975 6.126,9.765 4.850,11.729 C5.597,8.521 7.247,6.093 9.787,3.859 C5.962,3.455 2.849,2.369 0.011,0.006 C2.302,0.923 4.811,1.483 7.467,1.571 C9.393,1.634 11.344,1.178 13.131,0.582 L14.285,4.516 C12.735,4.967 11.198,5.583 9.911,6.491 Z')
			.fill('#444545').center(X0 + 100, 60);
		b.click(() => this.onRotate(1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54').center(X0 - 100, 60);
		b.path('M30.213,3.859 C32.753,6.093 34.403,8.521 35.150,11.729 C33.874,9.765 32.191,7.975 30.089,6.491 C28.802,5.583 27.265,4.967 25.715,4.516 L26.869,0.582 C28.656,1.178 30.607,1.634 32.533,1.571 C35.189,1.483 37.698,0.923 39.989,0.006 C37.151,2.369 34.038,3.455 30.213,3.859 ZM8.229,16.394 C6.849,20.781 7.337,25.239 9.218,29.108 C8.961,28.431 8.730,27.744 8.558,27.040 C9.467,24.691 11.324,22.860 13.624,21.809 C13.542,22.051 13.442,22.283 13.370,22.530 C11.751,28.048 13.022,33.646 16.322,38.004 C16.128,37.872 15.957,37.717 15.769,37.579 C15.818,37.685 15.878,37.786 15.925,37.893 C15.610,37.556 15.265,37.245 14.924,36.931 C14.626,36.687 14.341,36.435 14.061,36.177 C10.545,33.297 5.908,31.526 0.799,31.526 C0.528,31.526 0.265,31.553 -0.004,31.563 C1.652,29.870 3.994,28.748 6.632,28.561 C7.020,28.745 7.392,28.951 7.764,29.157 C3.513,24.557 1.751,18.187 3.708,11.965 C6.673,2.542 16.517,-1.280 26.804,0.802 L25.736,4.443 C17.514,4.251 10.747,8.391 8.229,16.394 Z')
			.fill('#444545').center(X0 - 100, 60);
		b.click(() => this.onRotate(-1));

		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Destroy').center(50, 30);
		b.center(X0 + 250, 60);
		b.click(() => this.onDestroy());

		let f = new BeltFactory(this.hex, this.direction, this.outflow + 1);
		b = svgMenuLayer.group();
		b.rect(100, 60).radius(4).fill('#ffffff').stroke('#434a54');
		b.text('Upgrade').center(50, 20);
		b.text('' + f.getRequiredBallsToBuild()).center(50, 40);
		b.center(X0 + 400, 60);
		b.click(() => this.onBuild(f));

	}
}
var game = new Game();

module.exports = {
	game,
	Board,
	Game,
	Hex,
	Ball,
	Factory,
	BeltFactory,
	BufferFactory,
	BuilderFactory,
	EmptyFactory,
	GeneratorFactory,
	MixerFactory
};
