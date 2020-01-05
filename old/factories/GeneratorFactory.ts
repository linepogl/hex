class GeneratorFactory extends Factory {
	public direction: SlotIndex = 0;
  public constructor(hex: Hex, direction: SlotIndex = 0) { super(hex); this.direction = direction; }

	private svgBackground: SVG.Element | null = null;
	private svgCenterDot: SVG.Element | null = null;

	public appear(): void {
	  this.svgBackground = this.game.svg
		  .polygon([[0, -66], [55, -33], [55, 33], [0, 66], [-55, 33], [-55, -33]])
		  .center(UI.cx + this.hex.x, UI.cy + this.hex.y)
		  .fill('#0099dd')
		  .click(() => this.hex.onClick());

	  this.svgBackground.attr({opacity: 0.1}).animate(500, '>').attr({opacity: 1});

	  this.svgCenterDot = this.game.svg
		  .circle(10)
		  .center(UI.cx + this.hex.x, UI.cy + this.hex.y)
		  .fill('#cccccc');
  }

  public disappear(): void {
	  if (this.svgCenterDot) {
		  this.svgCenterDot.animate(500, '<').attr({opacity:0.1}).queue(() => {
			  if (this.svgCenterDot) { this.svgCenterDot.remove(); this.svgCenterDot = null; }
		  });
	  }

	  if (this.svgBackground) {
		  this.svgBackground.animate(1000, '<').rotate(30).attr({opacity:0.75}).queue(() => {
			  if (this.svgBackground) { this.svgBackground.remove(); this.svgBackground = null; }
		  });
	  }
  }

	public onBeforeMoves(): void {
	  const ball_moving_out = this.hex.balls[this.direction];
    if (ball_moving_out) {
	    const hex = this.hex.links[this.direction];
	    if (hex) {
		    hex.proposeExternalBallForSlot(ball_moving_out, Hex.oppositeSlots[this.direction]);
	    }
    }
	}

	public onAfterMoves(): void {
		if (this.hex.balls[this.direction] === null) {
			const ball = new Ball(this.hex, this.direction);
			this.hex.balls[this.direction] = ball;
			ball.appear();
		}
	}

	public acceptsExternalBalls(slot: SlotIndex): boolean {
		return false;
	}
}
