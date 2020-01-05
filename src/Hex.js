'use strict';

class Hex {
	constructor(id, x, y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.links = [null, null, null, null, null, null];

		this.factory = new EmptyFactory(this);
		this.balls = [];
		this.incomingBallsRoundRobin = 0;

		this.hasIncomingBall = [false, false, false, false, false, false];
		this.isResolved = false;
		this.waitingForHexAtDirection = null;
		this.forcedIncomingDirectionDueToCycles = null;
		this.working = false;
		this.ballsToBeAbsorbed = [];
		this.countOutflow = 0;
		this.countInflow = 0;
		this.changed = false;
	}

	dump() {
		return {
			factory: this.factory.dump(),
			balls: this.balls.map(x => x.dump()),
			incomingBallsRoundRobin: this.incomingBallsRoundRobin,
		};
	}

	load(json) {
		if (json === null) json = { factory: { type: 'EmptyFactory' } };
		this.factory = Factory.from(this, json.factory);
		this.balls = (json.balls || []).map(x => Ball.from(this, x));
		this.incomingBallsRoundRobin = json.incomingBallsRoundRobin || 0;
	}

	getDebugInfo() {
		return {
			factory: this.factory.getDebugInfo(),
			balls: this.balls.map(x => x.getDebugInfo())
		}
	}

	draw() {
		this.factory.draw();
		this.balls.forEach((x, slot) => x.draw(slot));
		this.ballsToBeAbsorbed.forEach(x => x.draw(null));
		this.ballsToBeAbsorbed.length = 0;
	}

	//
	//
	// Geometry
	//
	//

	link(direction, hex) {
		this.links[direction] = hex;
		hex.links[this.getOppositeDirection(direction)] = this;
	}

	getLinkedHex(direction) {
		return this.links[direction] || null;
	}

	getOppositeDirection(direction) {
		return (direction + 3) % 6;
	}

	getCenter() {
		return [X0 + this.x * DX, Y0 + this.y * DY];
	}

	getSlotCenter(slot) {
		let x = X0 + this.x * DX;
		let y = Y0 + this.y * DY;
		if (slot !== null) {
			const DD = (this.balls.length - 1) * 2 - slot * 4;
			x += DD;
			y -= DD;
		}
		return [x, y];
	}

	////////////////////////////////////////////////////////////
	//                                                        //
	// Tick processing                                        //
	//                                                        //
	////////////////////////////////////////////////////////////

	prepareTick() {
		this.countInflow = 0;
		this.countOutflow = 0;
	}

	prepareMoves() {
		this.isResolved = false;
		this.isInCycle = null;
		this.changed = false;
		if (this.countOutflow < this.factory.getOutflowCapacity()) {
			this.factory.prepareMoves();
		}
	}

	detectCycles(step) {
		if (this.isInCycle !== null) return null;
		if (this.working) return this; // we have found the node that closes the circle!
		this.working = true;
		let circleNode = null;
		if (this.waitingForHexAtDirection !== null && this.factory.isSaturated()) {
			circleNode = this.links[this.waitingForHexAtDirection].detectCycles();
		}
		this.isInCycle = circleNode !== null;	
		if (this.isInCycle) {
			this.links[this.waitingForHexAtDirection].forcedIncomingDirectionDueToCycles = this.getOppositeDirection(this.waitingForHexAtDirection);
			this.waitingForHexAtDirection = null;
		}
		this.working = false;
		return circleNode === this ? null : circleNode; // we should not return the node that closes the circle the second time.
	}

	resolveMoves(step) {
		if (this.isResolved) return true;
		if (this.waitingForHexAtDirection !== null) return false;
		if (this.forcedIncomingDirectionDueToCycles !== null) {
			this.acceptIncomingBall(this.forcedIncomingDirectionDueToCycles);
			this.forcedIncomingBallDueToCycles = null;
		}
		else if (!this.factory.isSaturated()) {
			for (let i = 0; i < 6; i++) {
				const direction = this.incomingBallsRoundRobin;
				this.incomingBallsRoundRobin = (this.incomingBallsRoundRobin + 1) % 6;
				if (this.hasIncomingBall[direction]) {
					this.acceptIncomingBall(direction);
					break;
				}
			}
		}
		this.rejectIncomingBalls();
		this.factory.onAfterResolvingMoves(step);
		this.isResolved = true;
		return true;
	}

	//
	//
	// Model methods
	//
	//

	proposeBallTransferTowards(direction) {
		if (this.balls.length === 0) return false;
		if (this.balls[0].hasMoved) return false;
		const hex = this.getLinkedHex(direction);
		if (hex === null) return false;
		if (hex.countInflow >= hex.factory.inflowCapacity) return false;
		if (!hex.factory.couldAcceptBall(this.balls[0])) return false;
		hex.hasIncomingBall[this.getOppositeDirection(direction)] = true;
		this.waitingForHexAtDirection = direction;
		return true;
	}

	rejectIncomingBalls() {
		for (let i = 0; i < 6; i++) {
			if (this.hasIncomingBall[i]) {
				this.links[i].waitingForHexAtDirection = null;
				this.hasIncomingBall[i] = false;
			}
		}
	}

	acceptIncomingBall(direction) {
		if (this.hasIncomingBall[direction]) {
			this.acceptBall(this.links[direction].ejectOutgoingBall());
			this.hasIncomingBall[direction] = false;
		}
	}

	ejectOutgoingBall() {
		if (this.balls.length === 0) return null;
		const ball = this.balls[0];
		this.coutOutflow++;
		this.balls.shift();
		this.waitingForHexAtDirection = null;
		this.changed = true;
		return ball;
	}

	acceptBall(ball) {
		if (ball === null) return null;
		ball.moveTo(this);
		this.balls.push(ball);
		this.countInflow++;
		this.changed = true;
		return ball;
	}

	absorbBall(ball) {
		this.ballsToBeAbsorbed.push(ball);
	}
}

