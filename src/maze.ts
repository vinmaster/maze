import { Coord } from './global';

interface Cell {
  walls: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}

export class Maze {
  grid: Cell[][];
  generator: MazeGenerator;

  constructor(rows, cols) {
    this.grid = Array.from({ length: rows },
      () =>
        Array.from({ length: cols }, () =>
        ({
          walls: {
            top: true,
            bottom: true,
            left: true,
            right: true
          }
        })));
  }

  inGrid(coord: Coord): boolean {
    let [col, row] = coord;
    return row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;
  }

  generate(generatorName: 'Recursive Backtracking') {
    this.generator = new MazeGenerator(generatorName, this);
  }

  static coordToString(coord: Coord) {
    return `${coord[0]},${coord[1]}`;
  }

  static stringToCoord(s: string): Coord {
    let [cs, rs] = s.split(',');
    return [parseInt(cs, 10), parseInt(rs, 10)];
  }
}

export class MazeGenerator {
  generatorName: string;
  maze: Maze;
  step: Generator<{ current: Coord; visited: Set<string>; }, void, unknown>;
  current: Coord;
  starting: Coord;
  visited: Set<string>;

  constructor(generatorName = 'Recursive Backtracking', maze: Maze) {
    this.generatorName = generatorName;
    if (generatorName === 'Recursive Backtracking') {
      let col = Math.floor(Math.random() * window.maxCols);
      let row = Math.floor(Math.random() * window.maxRows);
      this.current = [col, row];
      this.starting = [col, row];
      this.visited = new Set<string>();
      this.step = this.recursiveBacktracking();
    }
    this.maze = maze;
  }

  private *recursiveBacktracking(current = this.current) {
    let [col, row] = current;
    if (!this.visited.has(Maze.coordToString(current))) {
      yield { current: current, visited: this.visited };
      this.visited.add(Maze.coordToString(current));
      let deltas = this.directionDeltas;
      this.randomize(deltas);
      let nextCoords: Coord[] = deltas.map(([c, r]) => {
        let newCol = c + col;
        let newRow = r + row;
        let newCoord: Coord = [newCol, newRow];
        return this.maze.inGrid(newCoord) ? newCoord : null;
      }).filter(c => c !== null);
      for (let i = 0; i < nextCoords.length; i++) {
        let nextCoord = nextCoords[i];
        if (this.visited.has(Maze.coordToString(nextCoord))) {
          continue;
        }
        let [nextCol, nextRow] = nextCoord;
        let dir = this.calculateDirection(current, nextCoord);
        let oppositeDir = this.calculateDirection(nextCoord, current);
        this.maze.grid[row][col].walls[dir] = false;
        this.maze.grid[nextRow][nextCol].walls[oppositeDir] = false;
        yield* this.recursiveBacktracking(nextCoord);
      }
    }
  }

  private calculateDirection(current: Coord, target: Coord): 'top' | 'bottom' | 'left' | 'right' {
    let index = this.directionDeltas.findIndex(([col, row]) => current[0] + col === target[0] && current[1] + row === target[1]);
    let directions: Array<'top' | 'bottom' | 'left' | 'right'> = ['left', 'right', 'top', 'bottom'];
    if (index === -1) {
      throw new Error(`Invalid direction ${current} to ${target}`);
    } else {
      return directions[index];
    }
  }

  // Top, bottom, left, right
  private get directionDeltas(): Coord[] {
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
  }

  private randomize(array: any[]) {
    array.sort((a, b) => 0.5 - Math.random());
  }
}