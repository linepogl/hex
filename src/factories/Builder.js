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
	getInflowCapacity() { return 1000; }
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
		this.svgElement.find('.progress').clipper().transform({ scaleX: this.getPercentage(), origin: 'left' });
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
			this.hex.countInflow = this.target.getInflowCapacity();
			this.hex.countOutflow = this.target.getOutflowCapacity();
		}
	}
}



