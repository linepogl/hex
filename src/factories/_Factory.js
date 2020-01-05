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
