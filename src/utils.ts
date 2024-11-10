import { Player } from './classes';
import {
	background,
	canvas,
	ctx,
	displayTextDiv,
	enemy,
	enemyHealthBar,
	keys,
	player,
	playerHealthBar,
	popupDiv,
	shop,
	timerDiv,
} from './constants';

let timer = 100;

export const animate = () => {
	window.requestAnimationFrame(animate);

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	background.draw();
	shop.update();

	// Light overlay behind player
	ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player movement
	if (keys.a.pressed && player.lastKeyPressed === 'a') {
		player.velocity.x = -10;
		player.switchSprite('run');
		if (player.position.x + player.velocity.x === 0) {
			player.velocity.x = 0;
		}
	} else if (keys.d.pressed && player.lastKeyPressed === 'd') {
		player.velocity.x = 10;
		player.switchSprite('run');
		if (player.position.x + player.width + player.velocity.x >= canvas.width) {
			player.velocity.x = 0;
		}
	} else {
		player.switchSprite('idle');
	}

	// Jump the player
	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
		enemy.velocity.x = -10;
		enemy.switchSprite('run');
		if (enemy.position.x + enemy.velocity.x === 0) {
			enemy.velocity.x = 0;
		}
	} else if (keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
		enemy.image! = enemy.sprites?.run.image!;
		enemy.framesMax = enemy.sprites?.run.framesMax!;
		enemy.velocity.x = 10;
		enemy.switchSprite('run');
		if (enemy.position.x + enemy.width + enemy.velocity.x >= canvas.width) {
			enemy.velocity.x = 0;
		}
	} else {
		enemy.switchSprite('idle');
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}
	// detect for collision
	if (
		enemy.position.y + enemy.height >= player.attackRow.position.y &&
		enemy.position.y <= player.attackRow.position.y + player.attackRow.height! &&
		enemy.position.x + enemy.width >= player.attackRow.position.x &&
		enemy.position.x + player.offset.x <= player.attackRow.position.x + player.attackRow.width! &&
		player.isAttacking &&
		player.framesCurrent === 4
	) {
		enemy.takeHit();
		player.isAttacking = false;
		enemyHealthBar.style.width = `${enemy.health}%`;
	}

	// if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	if (
		player.position.y + player.height >= enemy.attackRow.position.y &&
		player.position.y <= enemy.attackRow.position.y + enemy.attackRow.height! &&
		// 50 added to account for the rage of enemy attack
		player.position.x + player.width + 50 >= enemy.attackRow.position.x &&
		player.position.x <= enemy.attackRow.position.x + enemy.attackRow.width! &&
		enemy.isAttacking &&
		enemy.framesCurrent === 2
	) {
		player.takeHit();
		enemy.isAttacking = false;
		playerHealthBar.style.width = `${player.health}%`;
	}

	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

	if (player.health <= 0 || enemy.health <= 0) {
		determineWinner({
			player1: player,
			player2: enemy,
			timerId: intervalId,
		});
	}
};

export const determineWinner = ({
	player1,
	player2,
	timerId,
}: {
	player1: Player;
	player2: Player;
	timerId?: number;
}) => {
	timerId && clearInterval(timerId);
	popupDiv.style.display = 'block';
	if (player1.health === player2.health) {
		displayTextDiv.textContent = 'Tie';
	} else if (player1.health > player2.health) {
		displayTextDiv.textContent = 'Player 1 wins';
		enemy.switchSprite('death');
	} else {
		displayTextDiv.textContent = 'Player 2 wins';
		player.switchSprite('death');
	}
};

let intervalId: number | undefined;

const startTimer = () => {
	intervalId = setInterval(() => {
		if (timer > 0) {
			timer--;
			timerDiv.innerText = timer.toString();
		}
		if (timer === 0) {
			determineWinner({
				player1: player,
				player2: enemy,
				timerId: intervalId,
			});
		}
	}, 1000);
};

export const showPlayerControllers = () => {
	const localStorageKey = 'playerControlsShown';
	const okButton = document.querySelector<HTMLButtonElement>('#ok-button')!;
	const playerControls = document.querySelector<HTMLDivElement>('.display-player-controls')!;

	if (!localStorage.getItem(localStorageKey)) {
		playerControls.style.display = 'block';
		okButton.addEventListener('click', () => {
			localStorage.setItem(localStorageKey, 'true');
			playerControls.style.display = 'none';
			startTimer();
		});
	} else {
		startTimer();
	}
};
