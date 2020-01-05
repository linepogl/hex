class Ball {
  public readonly game: Game;
  public hex: Hex;
  public slot: SlotIndex;
  public x : number = 0;
  public y : number = 0;

  public isProposedToMove: boolean = false;

  public constructor(hex: Hex, slot: SlotIndex) {
    this.game = hex.game;
    this.hex = hex;
    this.slot = slot;
    this.x = hex.x + Hex.slotOffsets[slot].x;
    this.y = hex.y + Hex.slotOffsets[slot].y;
  }

  public moveToSlot(hex: Hex, slot: SlotIndex) {
  	const isSameHex = this.hex === hex;

  	if (this.hex.balls[this.slot] === this) this.hex.balls[this.slot] = null;

    this.hex = hex;
    this.slot = slot;
    this.x = hex.x + Hex.slotOffsets[slot].x;
    this.y = hex.y + Hex.slotOffsets[slot].y;

    this.hex.balls[this.slot] = this;

    if (this.svgSprite) {
    	if (isSameHex) {
		    this.svgSprite.animate(500,'<').center(UI.cx + this.hex.x, UI.cy + this.hex.y);
		    this.svgSprite.animate(500,'>').center(UI.cx + this.x, UI.cy + this.y);
	    }
    	else {
		    this.svgSprite.animate(1000,'<>').center(UI.cx + this.x, UI.cy + this.y);
	    }
    }
  }

  private svgSprite: SVG.Element | null = null;

  public appear(): void {
    this.svgSprite = this.game.svg
      .circle(22)
	    .center(UI.cx + this.x, UI.cy + this.y)
      .fill('#88aa88');

    this.svgSprite
	    .center(UI.cx + this.hex.x, UI.cy + this.hex.y).attr({opacity: 0.5}).scale(0.5)
	    .animate(500, '>')
	    .center(UI.cx + this.x, UI.cy + this.y).attr({opacity: 1}).scale(1);
  }

  public disappear() : void {
    if (this.svgSprite) {
      this.svgSprite.animate(1000, '>').attr({opacity:0.1}).scale(1.5).queue(() => {
        if (this.svgSprite) { this.svgSprite.remove(); this.svgSprite = null; }
      });
    }
  }
}
