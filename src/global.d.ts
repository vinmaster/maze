import { Maze } from './maze';

export declare global {
  interface Window {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    backgroundColor: string;
    intervalId: number;
    maze: Maze;
    maxRows: number;
    maxCols: number;
    cellSize: number;
    padding: number;
  }
}

export type Point = [number, number];

export type Dimension = [number, number];

export type Coord = [number, number];
