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
