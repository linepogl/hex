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

