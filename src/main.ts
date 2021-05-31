import '../style.css';
import { Maze } from './maze';
import { render } from './renderer';

function main() {
  window.backgroundColor = '#404040';
  window.width = window.innerWidth;
  window.height = window.innerHeight;
  window.maxRows = 12;
  window.maxCols = 10;
  window.padding = 10;

  if (window.width > window.height) {
    window.cellSize = (window.height - (window.padding * 2)) / window.maxRows;
  } else {
    window.cellSize = (window.width - (window.padding * 2)) / window.maxCols;
  }
  if (window.cellSize > 50) window.cellSize = 50;

  window.maze = new Maze(window.maxRows, window.maxCols);
  window.maze.generate('Recursive Backtracking');

  setElements();
  setHooks();
  play();
}

function setElements() {
  let canvasContainer = document.getElementById('app');
  let dimensions = document.getElementById('dimensions');
  let gridSize = document.getElementById('grid-size');
  let strategy = document.getElementById('strategy');
  canvasContainer.innerHTML = '';
  canvasContainer.innerHTML += '<canvas id="canvas" width="' + window.width + '" height="' + window.height + '"></canvas>';
  dimensions.innerHTML = window.width + 'px x ' + window.height + 'px';
  gridSize.innerHTML = `${window.maxRows} rows ${window.maxCols} cols`;
  strategy.innerHTML = `Generation Strategy: ${window.maze.generator.generatorName}`;
  let canvas = document.getElementById('canvas') as HTMLCanvasElement;
  window.ctx = canvas.getContext('2d');
}

function addClass(e) {
  let sidebar = document.querySelector('.sidebar');
  let overlay = document.querySelector('.sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
}

function closeSidebar(e = null) {
  let sidebar = document.querySelector('.sidebar');
  let overlay = document.querySelector('.sidebar-overlay');
  if (!e || (e.target.classList.contains('sidebar-overlay') &&
    e.target.classList.contains('visible'))) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  }
}

function setHooks() {
  let menu = document.getElementById('menu');
  let resetElement = document.getElementById('reset');
  let stopElement = document.getElementById('stop');
  let playElement = document.getElementById('play');
  let stepElement = document.getElementById('step');
  let overlay = document.querySelector('.sidebar-overlay');

  menu.removeEventListener('click', addClass);
  menu.addEventListener('click', addClass);
  resetElement.removeEventListener('click', reset);
  resetElement.addEventListener('click', reset);
  stopElement.removeEventListener('click', stop);
  stopElement.addEventListener('click', stop);
  playElement.removeEventListener('click', play);
  playElement.addEventListener('click', play);
  stepElement.removeEventListener('click', step);
  stepElement.addEventListener('click', step);
  overlay.removeEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
}

function stop() {
  clearInterval(window.intervalId);
  document.getElementById('play').style.display = 'block';
  document.getElementById('stop').style.display = 'none';
}

function play() {
  // Use requestAnimationFrame for more performance
  window.intervalId = setInterval(function () {
    step();
  }, 200);
  document.getElementById('play').style.display = 'none';
  document.getElementById('stop').style.display = 'block';
}

function step() {
  render(window.maze);
}

function reset() {
  stop();
  main();
  closeSidebar();
}

main();
window.addEventListener('resize', reset);
document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.remove('preload');
});
