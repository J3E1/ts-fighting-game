import { enemy, keys, player } from './constants';

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
