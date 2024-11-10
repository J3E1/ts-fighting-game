import { Player, Sprite } from './classes';

export const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
export const playerHealthBar = document.querySelector<HTMLDivElement>('#player-health')!;
export const enemyHealthBar = document.querySelector<HTMLDivElement>('#enemy-health')!;
export const popupDiv = document.querySelector<HTMLDivElement>('.popup')!;
export const displayTextDiv = document.querySelector<HTMLDivElement>('#display-text')!;
export const replayBtn = document.querySelector<HTMLDivElement>('#replay-btn')!;
export const timerDiv = document.querySelector<HTMLDivElement>('.timer')!;

export const ctx = canvas.getContext('2d')!;

export const gravity = 1;

canvas.width = 1024;
canvas.height = 576;

export const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: '/background.png',
	offset: {
		x: 0,
		y: 0,
	},
});

export const shop = new Sprite({
	position: {
		x: 630,
		y: 128,
	},
	imageSrc: '/shop.png',
	scale: 2.75,
	framesMax: 6,
	offset: {
		x: 0,
		y: 0,
	},
});

export const player = new Player({
	position: {
		x: 40,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: -130,
		y: -153,
	},
	imageSrc: '/Rigrider/Idle.png',
	framesMax: 10,
	scale: 3,
	attackRow: {
		offset: {
			x: 100,
			y: 50,
		},
		height: 40,
		width: 160,
	},
	sprites: {
		attack: {
			imageSrc: '/Rigrider/Attack1.png',
			framesMax: 7,
		},
		death: {
			imageSrc: '/Rigrider/Death.png',
			framesMax: 7,
		},
		fall: {
			imageSrc: '/Rigrider/Fall.png',
			framesMax: 3,
		},
		idle: {
			imageSrc: '/Rigrider/Idle.png',
			framesMax: 10,
		},
		jump: {
			imageSrc: '/Rigrider/Jump.png',
			framesMax: 3,
		},
		run: {
			imageSrc: '/Rigrider/Run.png',
			framesMax: 8,
		},
		takeHit: {
			imageSrc: '/Rigrider/Take hit.png',
			framesMax: 3,
		},
	},
});

export const enemy = new Player({
	position: {
		x: canvas.width - 60,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: -400,
		y: -183,
	},
	imageSrc: '/kenji/Idle.png',
	framesMax: 4,
	scale: 2.6,
	attackRow: {
		offset: {
			x: -350,
			y: 50,
		},
		height: 40,
		width: 190,
	},
	sprites: {
		attack: {
			imageSrc: '/kenji/Attack1.png',
			framesMax: 4,
		},
		death: {
			imageSrc: '/kenji/Death.png',
			framesMax: 7,
		},
		fall: {
			imageSrc: '/kenji/Fall.png',
			framesMax: 2,
		},
		idle: {
			imageSrc: '/kenji/Idle.png',
			framesMax: 4,
		},
		jump: {
			imageSrc: '/kenji/Jump.png',
			framesMax: 2,
		},
		run: {
			imageSrc: '/kenji/Run.png',
			framesMax: 8,
		},
		takeHit: {
			imageSrc: '/kenji/Take hit.png',
			framesMax: 3,
		},
	},
});

export const keys = {
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
