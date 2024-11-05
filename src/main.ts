const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;

const ctx = canvas.getContext('2d')!;

const gravity = 1;

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

type Position = { x: number; y: number };

class Sprite {
	position: Position;
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
	color: string;

	constructor({
		position,
		velocity,
		color,
		offset,
	}: {
		position: Position;
		velocity: Position;
		offset: Position;
		color?: string;
	}) {
		this.height = 150;
		this.width = 50;
		this.isAttacking = false;

		this.lastKeyPressed = '';

		this.position = position;
		this.velocity = velocity;
		this.color = color || 'red';
		this.attackRow = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset,
			width: 100,
			height: 50,
		};
	}

	draw() {
		// Players
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		// attackRow
		if (this.isAttacking) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(
				this.attackRow.position.x,
				this.attackRow.position.y,
				this.attackRow.width,
				this.attackRow.height
			);
		}
	}

	update() {
		this.draw();

		this.attackRow.position.x = this.position.x + this.attackRow.offset.x;
		this.attackRow.position.y = this.position.y + this.attackRow.offset.y;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		} else {
			this.velocity.y += gravity;
		}

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

const player = new Sprite({
	position: {
		x: 10,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: 0,
		y: 0,
	},
});

const enemy = new Sprite({
	position: {
		x: 400,
		y: 400,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: -50,
		y: 0,
	},
	color: 'blue',
});

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
};

const animate = () => {
	window.requestAnimationFrame(animate);

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player movement
	if (keys.a.pressed && player.lastKeyPressed === 'a') {
		player.velocity.x = -5;
		if (player.position.x + player.velocity.x === 0) {
			player.velocity.x = 0;
		}
	}
	if (keys.d.pressed && player.lastKeyPressed === 'd') {
		player.velocity.x = 5;
		if (player.position.x + player.width + player.velocity.x >= canvas.width) {
			player.velocity.x = 0;
		}
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
		enemy.velocity.x = -5;
		if (enemy.position.x + enemy.velocity.x === 0) {
			enemy.velocity.x = 0;
		}
	}
	if (keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
		enemy.velocity.x = 5;
		if (enemy.position.x + enemy.width + enemy.velocity.x >= canvas.width) {
			enemy.velocity.x = 0;
		}
	}

	// detect for collision
	if (
		enemy.position.y + enemy.height >= player.attackRow.position.y &&
		enemy.position.y <= player.attackRow.position.y + player.attackRow.height &&
		enemy.position.x + enemy.width >= player.attackRow.position.x &&
		enemy.position.x <= player.attackRow.position.x + player.attackRow.width &&
		player.isAttacking
	) {
		console.log('Player hit enemy');
		player.isAttacking = false;
	}

	if (
		player.position.y + player.height >= enemy.attackRow.position.y &&
		player.position.y <= enemy.attackRow.position.y + enemy.attackRow.height &&
		player.position.x + player.width >= enemy.attackRow.position.x &&
		player.position.x <= enemy.attackRow.position.x + enemy.attackRow.width &&
		enemy.isAttacking
	) {
		console.log('Enemy hit player');
		enemy.isAttacking = false;
	}
};

animate();

window.addEventListener('keydown', event => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = true;
			player.lastKeyPressed = 'd';
			break;
		case 'a':
			keys.a.pressed = true;
			player.lastKeyPressed = 'a';
			break;
		case 'w':
			player.velocity.y = -19;
			break;
		case ' ':
			player.attack();
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			enemy.lastKeyPressed = 'ArrowLeft';
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			enemy.lastKeyPressed = 'ArrowRight';
			break;
		case 'ArrowUp':
			enemy.velocity.y = -19;
			break;
		case 'ArrowDown':
			enemy.attack();
			break;
	}
});

window.addEventListener('keyup', event => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
	}
});
