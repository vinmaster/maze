import { drawLine, drawRect, fillRect } from './canvas';
import { Coord, Dimension, Point } from './global';
import { Maze } from './maze';

/**
Notes:
- lineWidth will add 50% of its width to each of the sides of the path itself
*/

let lineWidth = 2;

function render(maze: Maze) {
  // window.ctx.clearRect(0, 0, window.width, window.height);

  window.ctx.fillStyle = window.backgroundColor;
  window.ctx.fillRect(0, 0, window.width, window.height);

  // window.ctx.strokeStyle = 'blue';
  // window.ctx.lineWidth = 10;
  // drawLine(window.ctx, [100, 100], [100, 300], '#6495ED', 5);
  // drawGrid(window.ctx);
  // maze.grid[5][1].walls.bottom = false;
  // maze.grid[6][1].walls.top = false;
  drawMaze(window.ctx, maze);

  let next = maze.generator.step.next();
  if (!next.done && next.value) {
    // console.log(next.value, next.done);
    // console.log(next.value.current);
    for (let visited of next.value.visited) {
      fillCell(window.ctx, Maze.stringToCoord(visited));
    }
    fillCell(window.ctx, next.value.current, 'yellow');
  }

  // drawWall(window.ctx, [1, 2], undefined, window.backgroundColor);
  // fillCell(window.ctx, [1, 2]);
  // fillCell(window.ctx, [0, 2]);
  // fillCell(window.ctx, [1, 3]);
  // fillCell(window.ctx, [0, 3]);
  // fillCell(window.ctx, [1, 4]);
  // fillCell(window.ctx, [0, 4]);
};

function drawGrid(ctx: CanvasRenderingContext2D, stroke = undefined, width = lineWidth) {
  let maxX = window.maxCols * window.cellSize;
  let maxY = window.maxRows * window.cellSize;
  let offsetX = (window.width - (maxX + (window.padding * 2))) / 2;
  let offsetY = (window.height - (maxY + (window.padding * 2))) / 2;
  let dim: Dimension = [maxX, maxY];
  drawRect(ctx, [window.padding + offsetX, window.padding + offsetY], dim, stroke, width);
  for (let col = 0; col < window.maxCols; col++) {
    let x = (col * window.cellSize) + window.padding + offsetX;
    drawLine(ctx, [x, window.padding + offsetY], [x, maxY + window.padding + offsetY], stroke, width);
  }
  for (let row = 0; row < window.maxRows; row++) {
    let y = (row * window.cellSize) + window.padding + offsetY;
    drawLine(ctx, [window.padding + offsetX, y], [maxX + window.padding + offsetX, y], stroke, width);
  }
  // drawRoundedRect(ctx, 19, 19, 150, 150, 15);
}

function fillCell(ctx: CanvasRenderingContext2D, coord: Coord, fill = window.backgroundColor) {
  ctx.save();
  let point = coordToPoint(coord);
  point = [point[0] + 1, point[1] + 1];
  // +1 is for rounding error, cover up the 1px border
  // fillRect(ctx, point, [window.cellSize + 1, window.cellSize + 1], 'grey');
  fillRect(ctx, point, [window.cellSize - 2, window.cellSize - 2], fill);
  ctx.restore();
}

function drawWall(ctx: CanvasRenderingContext2D, coord: Coord, placement: 'all' | 'none' | 'top' | 'bottom' | 'left' | 'right' = 'all', stroke = undefined, width = lineWidth) {
  let [x, y] = coordToPoint(coord);
  switch (placement) {
    case 'top':
      drawLine(ctx, [x, y], [x + window.cellSize, y], stroke, width);
      break;
    case 'bottom':
      drawLine(ctx, [x, y + window.cellSize], [x + window.cellSize, y + window.cellSize], stroke, width);
      break;
    case 'left':
      drawLine(ctx, [x, y], [x, y + window.cellSize], stroke, width);
      break;
    case 'right':
      drawLine(ctx, [x + window.cellSize, y], [x + window.cellSize, y + window.cellSize], stroke, width);
      break;
    case 'none':
      break;
    default:
      drawLine(ctx, [x, y], [x + window.cellSize, y], stroke, width);
      drawLine(ctx, [x, y + window.cellSize], [x + window.cellSize, y + window.cellSize], stroke, width);
      drawLine(ctx, [x, y], [x, y + window.cellSize], stroke, width);
      drawLine(ctx, [x + window.cellSize, y], [x + window.cellSize, y + window.cellSize], stroke, width);
      break;
  }
}

function drawMaze(ctx: CanvasRenderingContext2D, maze: Maze) {
  let maxX = window.maxCols * window.cellSize;
  let maxY = window.maxRows * window.cellSize;
  let offsetX = (window.width - (maxX + (window.padding * 2))) / 2;
  let offsetY = (window.height - (maxY + (window.padding * 2))) / 2;
  let dim: Dimension = [maxX, maxY];
  drawRect(ctx, [window.padding + offsetX, window.padding + offsetY], dim, undefined, lineWidth);

  for (let row = 0; row < window.maxRows; row++) {
    for (let col = 0; col < window.maxCols; col++) {
      let entries = Object.entries(maze.grid[row][col].walls);
      entries.forEach(([str, bool]) => bool ? drawWall(window.ctx, [col, row], str as any) : null);
    }
  }
}

function coordToPoint(coord: Coord): Point {
  let maxX = window.maxCols * window.cellSize;
  let maxY = window.maxRows * window.cellSize;
  let offsetX = (window.width - (maxX + (window.padding * 2))) / 2;
  let offsetY = (window.height - (maxY + (window.padding * 2))) / 2;
  let [col, row] = coord;
  let x = window.padding + offsetX + (col * window.cellSize);
  let y = window.padding + offsetY + (row * window.cellSize);

  return [x, y];
}

export { render };
