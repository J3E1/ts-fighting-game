import { canvas, ctx, gravity } from './constants';

type Position = { x: number; y: number };
type PlayerState = 'idle' | 'run' | 'jump' | 'fall' | 'attack' | 'death';
type PlayersSprite = {
	imageSrc: string;
	framesMax: number;
	image?: HTMLImageElement;
};
('takeHit');
export class Sprite {
	position: Position;
	scale: number;
	framesMax: number;
	framesCurrent: number;
	framesElapsed: number;
	framesHold: number;
	image: HTMLImageElement;
	offset: Position;
	sprites?: Record<PlayerState, PlayersSprite>;

	constructor({
		position,
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset,
		sprites,
	}: {
		position: Position;
		offset: Position;
		imageSrc: string;
		scale?: number;
		framesMax?: number;
		sprites?: Record<PlayerState, PlayersSprite>;
	}) {
		this.position = position;
		this.scale = scale;
		this.framesMax = framesMax;
		this.image = new Image();
		this.image.src = import.meta.env.BASE_URL + imageSrc;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 7;
		this.offset = offset;
		this.sprites = sprites;
		if (this.sprites)
			for (const sprite in this.sprites) {
				this.sprites[sprite as PlayerState].image = new Image();
				this.sprites[sprite as PlayerState].image!.src =
					import.meta.env.BASE_URL + this.sprites[sprite as PlayerState].imageSrc;
			}
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

	switchSprite(sprite: PlayerState) {
		if (
			this.image === this.sprites!.attack.image &&
			this.framesCurrent < this.sprites!.attack.framesMax - 1
		)
			return;
		this.image = this.sprites![sprite].image!;
		this.framesMax = this.sprites![sprite].framesMax!;
		this.framesCurrent = 0;
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
		width?: number;
		height?: number;
	};
	health: number;

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
		sprites?: Record<PlayerState, PlayersSprite>;
		attackRow: {
			offset: Position;
			width?: number;
			height?: number;
		};
	}) {
		super({ imageSrc, scale, framesMax, position, offset, sprites });
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
			offset: attackRow.offset,
			width: attackRow.width,
			height: attackRow.height,
		};

		this.framesHold = 4;
	}

	update() {
		this.draw();
		this.animateFrames();

		// Move attack row with the player
		this.attackRow.position.x = this.position.x + this.attackRow.offset.x;
		this.attackRow.position.y = this.position.y + this.attackRow.offset.y;

		if (this.attackRow.width && this.attackRow.height) {
			ctx.fillRect(
				this.attackRow.position.x,
				this.attackRow.position.y,
				this.attackRow.width,
				this.attackRow.height
			);
		}

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
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}
