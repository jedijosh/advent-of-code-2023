export class Vector {
    direction: String
    magnitude: number

    constructor(magnitude: number, direction: String) {
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