var expect = require('expect.js');
var Hex = require('../res/bundle.js');

describe('Edge cases', function () {

	it('Should resolve a saturated cycle with different outflows', function () {
		var board = new Hex.Board({
			hexes: [
				{ factory: { type: 'BeltFactory', direction: 1, outflow: 2 }, balls: [{ type: '1' }, { type: '2' }] },
				{ factory: { type: 'BeltFactory', direction: 3, outflow: 1 }, balls: [{ type: '3' }] },
				{ factory: { type: 'BeltFactory', direction: 5, outflow: 1 }, balls: [{ type: '4' }] },
			]
		});
		Hex.game.time++; board.tick();
		expect(board.ballTypes.slice(0, 3)).to.eql([['2','3'], ['4'],['1']]);
	});

	it('Should resolve a non-saturated cycle with different outflows', function () {
		var board = new Hex.Board({
			hexes: [
				{ factory: { type: 'BeltFactory', direction: 1, outflow: 2 }, balls: [{ type: '1' }] },
				{ factory: { type: 'BeltFactory', direction: 3, outflow: 1 }, balls: [{ type: '2' }] },
				{ factory: { type: 'BeltFactory', direction: 5, outflow: 1 }, balls: [{ type: '3' }] },
			]
		});
		Hex.game.time++; board.tick();
		expect(board.ballTypes.slice(0, 3)).to.eql([['2'], ['3'], ['1']]);
	});

});
