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
	shop,
	timerDiv,
} from './constants';

let timer = 10;

export const animate = () => {
	window.requestAnimationFrame(animate);

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	background.draw();
	shop.update();

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
		enemy.health -= 10;
		player.isAttacking = false;
		enemyHealthBar.style.width = `${enemy.health}%`;
	}

	if (
		player.position.y + player.height >= enemy.attackRow.position.y &&
		player.position.y <= enemy.attackRow.position.y + enemy.attackRow.height &&
		player.position.x + player.width >= enemy.attackRow.position.x &&
		player.position.x <= enemy.attackRow.position.x + enemy.attackRow.width &&
		enemy.isAttacking
	) {
		player.health -= 10;
		enemy.isAttacking = false;
		playerHealthBar.style.width = `${player.health}%`;
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
	displayTextDiv.style.display = 'block';
	if (player1.health === player2.health) {
		displayTextDiv.textContent = 'Tie';
	} else if (player1.health > player2.health) {
		displayTextDiv.textContent = 'Player 1 wins';
	} else {
		displayTextDiv.textContent = 'Player 2 wins';
	}
};

const intervalId = setInterval(() => {
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
