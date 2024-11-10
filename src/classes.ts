import { canvas, ctx, gravity } from './constants';

type Position = { x: number; y: number };
type PlayerState = 'idle' | 'run' | 'jump' | 'fall' | 'attack' | 'death' | 'takeHit';
type PlayersSprite = {
	imageSrc: string;
	framesMax: number;
	image?: HTMLImageElement;
};
export class Sprite {
	position: Position;
	scale: number;
	framesMax: number;
	framesCurrent: number = 0;
	framesElapsed: number = 0;
	framesHold: number = 5;
	image: HTMLImageElement;
	offset: Position;

	constructor({
		position,
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset,
	}: {
		position: Position;
		offset: Position;
		imageSrc: string;
		scale?: number;
		framesMax?: number;
	}) {
		this.position = position;
		this.scale = scale;
		this.framesMax = framesMax;
		this.image = new Image();
		this.image.src = import.meta.env.BASE_URL + imageSrc;
		this.offset = offset;
	}

	animateFrames() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax),
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x + this.offset.x,
			this.position.y + this.offset.y,
			(this.image.width / this.framesMax) * this.scale,
			this.image.height * this.scale
		);
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

export class Player extends Sprite {
	velocity: Position;
	height: number = 150;
	width: number = 50;
	lastKeyPressed: string = '';
	isAttacking: boolean = false;
	attackRow: {
		position: Position;
		offset: Position;
		width?: number;
		height?: number;
	};
	health: number = 100;
	dead: boolean = false;
	sprites: Record<PlayerState, PlayersSprite>;

	constructor({
		position,
		velocity,
		offset,
		imageSrc,
		scale = 1,
		framesMax = 1,
		sprites,
		attackRow,
	}: {
		position: Position;
		velocity: Position;
		offset: Position;
		imageSrc: string;
		scale?: number;
		framesMax?: number;
		sprites: Record<PlayerState, PlayersSprite>;
		attackRow: {
			offset: Position;
			width?: number;
			height?: number;
		};
	}) {
		super({ imageSrc, scale, framesMax, position, offset });
		this.velocity = velocity;
		this.attackRow = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: attackRow.offset,
			width: attackRow.width,
			height: attackRow.height,
		};

		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
		this.sprites = sprites;
		if (this.sprites)
			for (const sprite in this.sprites) {
				this.sprites[sprite as PlayerState].image = new Image();
				this.sprites[sprite as PlayerState].image!.src =
					import.meta.env.BASE_URL + this.sprites[sprite as PlayerState].imageSrc;
			}
	}

	update() {
		this.draw();
		if (!this.dead) this.animateFrames();

		// Move attack row with the player
		this.attackRow.position.x = this.position.x + this.attackRow.offset.x;
		this.attackRow.position.y = this.position.y + this.attackRow.offset.y;

		// Draw attack row
		// if (this.attackRow.width && this.attackRow.height) {
		// 	ctx.fillRect(
		// 		this.attackRow.position.x,
		// 		this.attackRow.position.y,
		// 		this.attackRow.width,
		// 		this.attackRow.height
		// 	);
		// }

		// Move left right
		this.position.x += this.velocity.x;

		// Don't let player over the canvas
		if (this.position.y + this.velocity.y > 0) {
			this.position.y += this.velocity.y;
		}

		// Stop when player is no bottom
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
			this.velocity.y = 0;
			this.position.y = 330;
		} else {
			this.velocity.y += gravity;
		}
		// Don't let player outside of canvas left right
		if (this.position.x + this.width + this.velocity.x >= canvas.width) {
			this.velocity.x = 0;
		}
	}

	attack() {
		this.switchSprite('attack');
		this.isAttacking = true;
	}

	takeHit() {
		this.health -= 20;

		if (this.health <= 0) {
			this.switchSprite('death');
		} else this.switchSprite('takeHit');
	}

	switchSprite(sprite: PlayerState) {
		if (!this.sprites) return;

		if (this.image === this.sprites.death.image) {
			if (this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true;
			return;
		}

		// overriding all other animations with the attack animation
		if (
			this.image === this.sprites.attack.image &&
			this.framesCurrent < this.sprites.attack.framesMax - 1
		)
			return;

		// override when fighter gets hit
		if (
			this.image === this.sprites.takeHit.image &&
			this.framesCurrent < this.sprites.takeHit.framesMax - 1
		)
			return;

		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image!;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image!;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image!;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image!;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'attack':
				if (this.image !== this.sprites.attack.image) {
					this.image = this.sprites.attack.image!;
					this.framesMax = this.sprites.attack.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image!;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.framesCurrent = 0;
				}
				break;

			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image!;
					this.framesMax = this.sprites.death.framesMax;
					this.framesCurrent = 0;
				}
				break;
		}
	}
}
