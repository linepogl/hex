
class Game {
  public static start() {
    const element : HTMLElement | null = document.getElementById('canvas');
    if (element === null) { console.log('Cannot find canvas'); return; }
    new Game(SVG('canvas').size('100%','100%').viewbox(0, 0, UI.w, UI.h)).start();
  }

  public readonly svg: SVG.Doc;

  public constructor(svg: SVG.Doc) {
    this.svg = svg;

	  this.svg.rect(200, 100).radius(10).move(0, 0).fill('#ff0000').click(() => {
		  if (this.board)
		  	this.stop();
		  else
		  	this.start();
	  });
  }

  private board : Board | null = null;
  private ticksInterval: number | null = null;

  public start() : void {
  	stop();
    this.board = new Board(this);
    this.board.appear();
	  this.ticksInterval = setInterval(() => this.tick(), 1000);
  }

	public stop() : void {
		if (this.ticksInterval) {
			clearInterval(this.ticksInterval);
			this.ticksInterval = null;
		}
		if (this.board) {
			this.board.disappear();
			this.board = null;
		}
	}

	public tick() : void {
	  if (this.board) this.board.tick();
  }
}
