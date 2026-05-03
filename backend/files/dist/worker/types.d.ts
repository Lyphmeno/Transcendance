import { StaticBody } from 'arcade-physics/lib/physics/arcade/StaticBody.js';
import { Collider } from 'arcade-physics/lib/physics/arcade/Collider.js';
import { Body } from 'arcade-physics/lib/physics/arcade/Body.js';
export type Size = {
    width: number;
    height: number;
};
export type Coordinates = {
    x: number;
    y: number;
};
export type Side = 'left' | 'right';
export type GameState = 'init' | 'ready' | 'created' | 'started' | 'stopped' | 'ended' | 'achievements';
export type ParentPortMessage = PlayerConstruct | PlayerUpdate | LoginData | StateUpdate;
export type GameEvent = 'goal' | 'blocked' | '3' | '2' | '1' | 'fight' | 'stop' | 'noHit';
export type Character = 'Boreas' | 'Helios' | 'Selene' | 'Liliana' | 'Orion' | 'Faeleen' | 'Rylan' | 'Garrick' | 'Thorian' | 'Test';
export interface Player {
    side: Side;
    body: Body;
    character: Character;
    stats: PlayerStats;
    achievements: PlayerAchievements;
    construct: PlayerConstruct;
    passiveWallBodies?: PassiveWalls;
    ballCollider?: Collider;
}
export interface PlayerAchievements {
    wasNotHit: boolean;
    hasNotHit: boolean;
    asGarrick: boolean;
    asBoreas: boolean;
    asHelios: boolean;
    asOrion: boolean;
    asFaeleen: boolean;
    asThorian: boolean;
}
export interface PlayerConstruct {
    side: Side;
    coords: Coordinates;
    size: Size;
    character: Character;
}
export interface PlayerStats {
    healthPoints: number;
    attackPoints: number;
    defensePoints: number;
    speedPoints: number;
    critChance: number;
    blockChance: number;
    lifeSteal: number;
}
export interface KeyStates {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}
export interface PlayerValues {
    left: number;
    right: number;
}
export interface PassiveWalls {
    up: StaticBody;
    down: StaticBody;
}
export interface Ball {
    body: Body;
    speed: number;
    leftUpPWallCollider?: Collider;
    leftDownPWallCollider?: Collider;
    rightUpPWallCollider?: Collider;
    rightDownPWallCollider?: Collider;
}
export interface LoginData {
    workerId: string;
}
export interface StateUpdate {
    newState: GameState;
}
export interface PlayerUpdate {
    side: Side;
    keyStates: KeyStates;
}
export interface NewProps {
    workerId: string;
    leftProps: Coordinates;
    rightProps: Coordinates;
    ballProps: Coordinates;
}
