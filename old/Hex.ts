
class Hex {
  public readonly game: Game;
  public readonly board: Board;
  public x : number = 0;
  public y : number = 0;
  public readonly links: Array<Hex | null> = [null, null, null, null, null, null];
  public readonly balls: Array<Ball | null> = [null, null, null, null, null, null];
  public factory: Factory;

  public constructor(board: Board, x: number, y: number) {
    this.board = board;
    this.game = board.game;
    this.factory = new EmptyFactory(this);
    this.x = x;
    this.y = y;
  }

	//     5  0
	//   4      1
	//     3  2
	public static readonly slotIndices: Array<SlotIndex> = [0, 1, 2, 3, 4, 5];
	public static readonly oppositeSlots: Array<SlotIndex> = [3, 4, 5, 0, 1, 2];
  public static readonly slotOffsets = [
    {x: 18.7, y: -33},
    {x: 36.3, y: 0},
    {x: 18.7, y: 33},
    {x: -18.7, y: 33},
    {x: -36.3, y: 0},
    {x: -18.7, y: -33}
  ];

  public onClick() : void {
    console.log(this);
    console.log('Click!');

    this.balls.forEach((ball, i) => {
      if (ball) {
        this.balls[i] = null;
        ball.disappear();
      }
    });

    // this.balls.forEach(ball => {
    //   if (ball) {
    //     const hex = this.links[ball.slot];
    //     if (hex) {
    //       ball.moveToSlot(hex, ball.slot);
    //     }
    //   }
    // });
  }

  public appear() : void {
  	this.factory.appear();
    setTimeout(() => { this.balls.forEach((ball, i) => { if (ball !== null) ball.appear(); }); }, 200);
  }

  public disappear() : void {
    this.balls.forEach(ball => { if (ball) ball.disappear(); });
    this.factory.disappear();
  }

  public onBeforeMoves(): void {
  	this.factory.onBeforeMoves();
  }

  public onAfterMoves(): void {
    // for (let slot = 0; slot < 6; slot++) {
    //   const ball = this.balls[slot];
    //   if (ball) ball.isProposedToMove = false;
    //   this.propositionsToOccupySlot[slot] = null;
    // }
    this.factory.onAfterMoves();
  }

  public resolveMoves(force: boolean = false): number {
    let needMoreWork = 0;
    for (let slot of Hex.slotIndices) {
      const incoming_ball = this.propositionsToOccupySlot[slot];
      const outgoing_ball = this.balls[slot];
      if (incoming_ball) {
        if (outgoing_ball === null) {
          incoming_ball.isProposedToMove = false;
          this.propositionsToOccupySlot[slot] = null;
          incoming_ball.moveToSlot(this, slot);
        }
        else if (outgoing_ball.isProposedToMove) {
          if (force) {
            incoming_ball.isProposedToMove = false;
            this.propositionsToOccupySlot[slot] = null;
            incoming_ball.moveToSlot(this, slot);
          }
          else {
            needMoreWork++;
          }
        }
        else {
          incoming_ball.isProposedToMove = false;
          this.propositionsToOccupySlot[slot] = null;
        }
      }
    }
    return needMoreWork;
  }

  public readonly propositionsToOccupySlot: Array<Ball | null> = [null, null, null, null, null, null];

  public  (ball: Ball, slot: SlotIndex): void {
    if (!this.factory.acceptsExternalBalls(slot)) return;
    const oldProposition = this.propositionsToOccupySlot[slot];
    if (oldProposition) return;
    this.propositionsToOccupySlot[slot] = ball;
    ball.isProposedToMove = true;
  }

  public proposeInternalBallForSlot(ball: Ball, slot: SlotIndex): void {
    const oldProposition = this.propositionsToOccupySlot[slot];
    if (oldProposition) oldProposition.isProposedToMove = false;
    this.propositionsToOccupySlot[slot] = ball;
    ball.isProposedToMove = true;
  }
}
