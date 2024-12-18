import { canvas, ctx } from './constants';
import { animate, showPlayerControllers } from './utils';
import './events.ts';

ctx.fillRect(0, 0, canvas.width, canvas.height);

animate();

showPlayerControllers();
