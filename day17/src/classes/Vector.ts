export class Vector {
    direction: number
    magnitude: number

    constructor(direction: number, magnitude: number) {
        this.direction = direction
        this.magnitude = magnitude
    }

    public getDirection() {
        return this.direction
    }

    public getMagnitude() {
        return this.magnitude
    }
}