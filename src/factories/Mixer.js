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
