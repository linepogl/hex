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

