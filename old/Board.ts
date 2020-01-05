class Board {
  public readonly game: Game;
  public readonly hexes : Array<Hex> = new Array<Hex>();
  public constructor(game: Game) {
    this.game = game;

    const dx = 60;
    const dy = 108.3;
    //    -6 -5 -4 -3 -2 -1  0  1  2  3  4  5  6
    // -4                   00
    // -3          01    02    03    04
    // -2 05    06    07    08    09    10    11
    // -1    12    13    14    15    16    17
    //  0 18    19    20    21    22    23    24
    //  1    25    26    27    28    29    30
    //  2 31    32    33    34    35    36    37
    //  3          38    39    40    41
    //  4                   42
    [
      [0, -4],
      [-3, -3], [-1, -3], [1, -3], [3, -3],
      [-6, -2], [-4, -2], [-2, -2], [0, -2], [2, -2], [4, -2], [6, -2],
      [-5, -1], [-3, -1], [-1, -1], [1, -1], [3, -1], [5, -1],
      [-6, 0], [-4, 0], [-2, 0], [0, 0], [2, 0], [4, 0], [6, 0],
      [-5, 1], [-3, 1], [-1, 1], [1, 1], [3, 1], [5, 1],
      [-6, 2], [-4, 2], [-2, 2], [0, 2], [2, 2], [4, 2], [6, 2],
      [-3, 3], [-1, 3], [1, 3], [3, 3],
      [0, 4]
    ].forEach(a => this.hexes.push(new Hex(this, a[0] * dx, a[1] * dy)));

    //     5  0
    //   4      1
    //     3  2
    [
      [ null, null,    3,    2, null, null ], //  0
      [ null,    2,    7,    6, null, null ], //  1
      [    0,    3,    8,    7,    1, null ], //  2
      [ null,    4,    9,    7,    2,    0 ], //  3
      [ null, null,   10,    9,    3, null ], //  4
      [ null,    6,   12, null, null, null ], //  5
      [    1,    7,   13,   12,    5, null ], //  6
      [    2,    8,   14,   13,    6,    1 ], //  7
      [    3,    9,   15,   14,    7,    2 ], //  8
      [    4,   10,   16,   15,    8,    3 ], //  9
      [ null,   11,   17,   16,    9,    4 ], // 10
      [ null, null, null,   17,   10, null ], // 11
      [    6,   13,   19,   18, null,    5 ], // 12
      [    7,   14,   20,   19,   12,    6 ], // 13
      [    8,   15,   21,   20,   13,    7 ], // 14
      [    9,   16,   22,   21,   14,    8 ], // 15
      [   10,   17,   23,   22,   15,    9 ], // 16
      [   11, null,   24,   23,   16,   10 ], // 17
      [   12,   19,   25, null, null, null ], // 18
      [   13,   20,   26,   25,   18,   12 ], // 19
      [   14,   21,   27,   26,   19,   13 ], // 20
      [   15,   22,   28,   27,   20,   14 ], // 21
      [   16,   23,   29,   28,   21,   15 ], // 22
      [   17,   24,   30,   29,   22,   16 ], // 23
      [ null, null, null,   30,   23,   17 ], // 24
      [   19,   26,   32,   31, null,   18 ], // 25
      [   20,   27,   33,   32,   25,   19 ], // 26
      [   21,   28,   34,   33,   26,   20 ], // 27
      [   22,   29,   35,   34,   27,   21 ], // 28
      [   23,   30,   36,   35,   28,   22 ], // 29
      [   24, null,   37,   36,   29,   23 ], // 30
      [   25,   32, null, null, null, null ], // 31
      [   26,   33,   38, null,   31,   25 ], // 32
      [   27,   34,   39,   38,   32,   26 ], // 33
      [   28,   35,   40,   39,   33,   27 ], // 34
      [   29,   36,   41,   40,   34,   28 ], // 35
      [   30,   37, null,   41,   35,   29 ], // 36
      [ null, null, null, null,   36,   30 ], // 37
      [   33,   39, null, null, null,   32 ], // 38
      [   34,   40,   42, null,   38,   33 ], // 39
      [   35,   41, null,   42,   39,   34 ], // 40
      [   36, null, null, null,   40,   35 ], // 41
      [   40, null, null, null, null,   39 ], // 42
    ].forEach((a, index) => {
      a.forEach((q, i) => {
        if (q !== null) this.hexes[index].links[i] = this.hexes[q];
      });
    });

    this.hexes[26].factory = new GeneratorFactory(this.hexes[26], 0);
    this.hexes[20].factory = new BeltFactory(this.hexes[20], 4);
    this.hexes[19].factory = new BeltFactory(this.hexes[19], 5);
    this.hexes[12].factory = new BeltFactory(this.hexes[12], 5);
    this.hexes[5].factory = new BeltFactory(this.hexes[5], 1);
    this.hexes[6].factory = new BeltFactory(this.hexes[6], 0);
    this.hexes[13].factory = new GeneratorFactory(this.hexes[13], 1);
	  this.hexes[14].factory = new BeltFactory(this.hexes[14], 0);
	  this.hexes[8].factory = new BeltFactory(this.hexes[8], 4);
	  this.hexes[7].factory = new BeltFactory(this.hexes[7], 2);

    this.hexes[35].factory = new BeltFactory(this.hexes[35], 1);
    this.hexes[36].factory = new BeltFactory(this.hexes[36], 5);
    this.hexes[29].factory = new BeltFactory(this.hexes[29], 3);

    this.hexes[35].balls[1] = new Ball(this.hexes[35], 1);
    this.hexes[35].balls[0] = new Ball(this.hexes[35], 0);
    this.hexes[36].balls[5] = new Ball(this.hexes[36], 5);
    this.hexes[36].balls[4] = new Ball(this.hexes[36], 4);
    this.hexes[29].balls[3] = new Ball(this.hexes[29], 3);
    this.hexes[29].balls[2] = new Ball(this.hexes[29], 2);

    // this.hexes[21].balls[0] = new Ball(this.hexes[21], 0);
    // this.hexes[21].balls[1] = new Ball(this.hexes[21], 1);
    // this.hexes[21].balls[2] = new Ball(this.hexes[21], 2);
    // this.hexes[21].balls[3] = new Ball(this.hexes[21], 3);
    // this.hexes[21].balls[4] = new Ball(this.hexes[21], 4);
    // this.hexes[21].balls[5] = new Ball(this.hexes[21], 5);
    // this.hexes[40].balls[5] = new Ball(this.hexes[40], 5);
  }

  private svgBackground: SVG.Element | null = null;

  public appear() : void {
    this.svgBackground = this.game.svg
      .polygon([[0, -528], [440, -264], [440, 264], [0, 528], [-440, 264], [-440, -264]])
      .center(UI.cx, UI.cy)
      .fill('#dddddd');

    this.svgBackground.scale(0.9, 0.9).animate(500, '>').scale(1,1);
    setTimeout(() => this.hexes.forEach(hex => hex.appear()), 250);
  }

  public disappear() : void {
    this.hexes.forEach(hex => hex.disappear());

    if (this.svgBackground) {
      this.svgBackground.animate(1000, '<').attr({opacity: 0.5}).scale(0.95).queue(() => {
        if (this.svgBackground) {
          this.svgBackground.remove();
          this.svgBackground = null;
        }
      });
    }
  }

  public tick(): void {
  	this.hexes.forEach(hex => hex.onBeforeMoves());

  	let prevNeedMoreWork = 0;
  	for (let wave = 0; ; wave++) {
  	  let needMoreWork = 0;
  	  this.hexes.forEach(hex => needMoreWork += hex.resolveMoves());
      console.log(wave, needMoreWork);
  	  if (needMoreWork === 0) break;
  	  if (needMoreWork === prevNeedMoreWork) {
        this.hexes.forEach(hex => needMoreWork += hex.resolveMoves(true));
      }
  	  prevNeedMoreWork = needMoreWork;
    }

    this.hexes.forEach(hex => hex.onAfterMoves());
  }
}
