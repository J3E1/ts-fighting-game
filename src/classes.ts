import { canvas, ctx, gravity } from './constants';

type Position = { x: number; y: number };

export class Sprite {
	position: Position;
	scale: number;
	framesMax: number;
	framesCurrent: number;
	framesElapsed: number;
	framesHold: number;
	image: HTMLImageElement;

	constructor({
		position,
		imageSrc,
		scale = 1,
		framesMax = 1,
	}: {
		position: Position;
		imageSrc: string;
		scale?: number;
		framesMax?: number;
	}) {
		this.position = position;
		this.scale = scale;
		this.framesMax = framesMax;
		this.image = new Image();
		this.image.src = imageSrc;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 7;
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x,
			this.position.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);
	}

	update() {
		this.draw();
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}
	}
}

export class Player extends Sprite {
	velocity: Position;
	height: number;
	width: number;
	lastKeyPressed: string;
	isAttacking: boolean;
	attackRow: {
		position: Position;
		offset: Position;
		width: number;
		height: number;
	};
	health: number;

	constructor({
		position,
		velocity,
		offset,
		imageSrc,
		scale = 1,
		framesMax = 1,
	}: {
		position: Position;
		velocity: Position;
		offset: Position;
		imageSrc: string;
		scale?: number;
		framesMax?: number;
	}) {
		super({ imageSrc, scale, framesMax, position });
		this.height = 150;
		this.width = 50;
		this.isAttacking = false;
		this.health = 100;

		this.lastKeyPressed = '';

		this.velocity = velocity;
		this.attackRow = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset,
			width: 100,
			height: 50,
		};

		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 7;
	}

	// draw() {
	// 	// Players
	// 	ctx.fillStyle = this.color;
	// 	ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

	// 	// attackRow
	// 	if (this.isAttacking) {
	// 		ctx.fillStyle = 'yellow';
	// 		ctx.fillRect(
	// 			this.attackRow.position.x,
	// 			this.attackRow.position.y,
	// 			this.attackRow.width,
	// 			this.attackRow.height
	// 		);
	// 	}
	// }

	update() {
		this.draw();

		// Move attack row with the player
		this.attackRow.position.x = this.position.x + this.attackRow.offset.x;
		this.attackRow.position.y = this.position.y + this.attackRow.offset.y;

		// Move left right
		this.position.x += this.velocity.x;

		// Don't let player over the canvas
		if (this.position.y + this.velocity.y > 0) {
			this.position.y += this.velocity.y;
		}

		// Stop when player is no bottom
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
			this.velocity.y = 0;
		} else {
			this.velocity.y += gravity;
		}

		// Don't let player outside of canvas left right
		if (this.position.x + this.width + this.velocity.x >= canvas.width) {
			this.velocity.x = 0;
		}
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}
