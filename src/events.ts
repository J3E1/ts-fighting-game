import { enemy, keys, player, replayBtn } from './constants';

replayBtn.addEventListener('click', () => {
	location.reload();
});

window.addEventListener('keydown', event => {
	if (!player.dead)
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
			case 's':
				player.attack();
				break;
		}

	if (!enemy.dead)
		switch (event.key) {
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
