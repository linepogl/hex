abstract class Factory {
	public readonly game: Game;
  public readonly hex: Hex;

  protected constructor(hex: Hex) {
  	this.game = hex.game;
    this.hex = hex;
  }

  public abstract appear(): void;
  public abstract disappear(): void;
  public abstract acceptsExternalBalls(slot: SlotIndex): boolean;
  public onBeforeMoves(): void {}
  public onAfterMoves(): void {}
}
