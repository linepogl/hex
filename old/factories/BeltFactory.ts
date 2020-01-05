class BeltFactory extends Factory {
	public direction: SlotIndex = 0;
	public round_robin: SlotIndex = 0;
	public constructor(hex: Hex, direction: SlotIndex = 0) {
		super(hex);
		this.direction = direction;
		this.round_robin = direction;
		this.advanceRoundRobin();
	}

	private svgBackground: SVG.Element | null = null;
	private svgCenterDot: SVG.Element | null = null;

	public appear(): void {
	  this.svgBackground = this.game.svg
		  .polygon([[0, -66], [55, -33], [55, 33], [0, 66], [-55, 33], [-55, -33]])
		  .center(UI.cx + this.hex.x, UI.cy + this.hex.y)
		  .fill('#dd99dd')
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

  public pickABall(): Ball | null {
		for (let i = 0; i < 6; i++) {
			if (this.round_robin !== this.direction) {
				const ball = this.hex.balls[this.round_robin];
				if (ball) return ball;
			}
			this.advanceRoundRobin();
		}
		return null;
  }

  private advanceRoundRobin(): void {
		switch (this.round_robin) {
			case 0: this.round_robin = 1; break;
			case 1: this.round_robin = 2; break;
			case 2: this.round_robin = 3; break;
			case 3: this.round_robin = 4; break;
			case 4: this.round_robin = 5; break;
			case 5: this.round_robin = 0; break;
		}
	}

  public onBeforeMoves() : void {
	  const ball_moving_out = this.hex.balls[this.direction];
    if (ball_moving_out) {
	    const hex = this.hex.links[this.direction];
	    if (hex) {
	    	hex.proposeExternalBallForSlot(ball_moving_out, Hex.oppositeSlots[this.direction]);
	    }
    }

    const ball_moving_internally = this.pickABall();
    if (ball_moving_internally) {
	    this.hex.proposeInternalBallForSlot(ball_moving_internally, this.direction);
    }
  }

	public acceptsExternalBalls(slot: SlotIndex): boolean {
		return true;
	}
}
