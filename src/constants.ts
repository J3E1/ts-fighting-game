import { Player, Sprite } from './classes';

export const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
export const playerHealthBar = document.querySelector<HTMLDivElement>('#player-health')!;
export const enemyHealthBar = document.querySelector<HTMLDivElement>('#enemy-health')!;
export const displayTextDiv = document.querySelector<HTMLDivElement>('#display-text')!;
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
	imageSrc: 'public/background.png',
});

export const shop = new Sprite({
	position: {
		x: 630,
		y: 128,
	},
	imageSrc: 'public/shop.png',
	scale: 2.75,
	framesMax: 6,
});

export const player = new Player({
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
	imageSrc: 'public/Rigrider/Idle.png',
	framesMax: 11,
	scale: 2.5,
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
		x: -50,
		y: 0,
	},
	imageSrc: 'public/Sophi/Idle.png',
	framesMax: 11,
	scale: 2.5,
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
