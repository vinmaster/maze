import { Dimension, Point } from './global';

function drawLine(ctx: CanvasRenderingContext2D, begin: Point, end: Point, stroke = 'black', width = 1) {
  ctx.save();
  if (stroke) {
    ctx.strokeStyle = stroke;
  }

  if (width) {
    ctx.lineWidth = width;
  }

  ctx.beginPath();
  ctx.moveTo(...begin);
  ctx.lineTo(...end);
  // ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawRect(ctx: CanvasRenderingContext2D, point: Point, dimension: Dimension, stroke = 'black', width = 1) {
  ctx.save();
  if (stroke) {
    ctx.strokeStyle = stroke;
  }

  if (width) {
    ctx.lineWidth = width;
  }

  ctx.strokeRect(...point, ...dimension);
  ctx.restore();
}

function fillRect(ctx: CanvasRenderingContext2D, point: Point, dimension: Dimension, fill = 'black') {
  ctx.save();
  if (fill) {
    ctx.fillStyle = fill;
  }

  ctx.fillRect(...point, ...dimension);
  ctx.restore();
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}

export { drawLine, drawRect, fillRect, drawRoundedRect };
