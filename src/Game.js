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

