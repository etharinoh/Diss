import { RGB_ETC1_Format } from "three";

export default class Node {
    constructor(name, circle) {
        this.name = name;
        this.circleObject = circle;
        this.connectionArr = [];
        this.packetQueue = [];
        this.inUse = false;
        this.rTable = [];
    }
    addConnection(connection) {
        this.connectionArr.push(connection);
    }

    use() {
        this.inUse = true;
    }
    finished() {
        this.inUse = false;
    }
    getConnectionArr() {
        return this.connectionArr;
    }

    enqueue(toAdd) {
        console.log(toAdd, 'enqueue', this.packetQueue)
        this.packetQueue.push(toAdd);
    }
    dequeue() {
        this.packetQueue.shift()
        var removed = this.packetQueue.shift();
        console.log(removed, 'dequeue')
    }
    isEmpty() {
        return this.packetQueue.length == 0;
    }
    addRouteToTable(destination, steps, nextConn, inv) {
        var newObj = { dest: destination, step: steps, conn: nextConn, invert: inv }
            this.rTable.push(newObj);



        
    }
    
    routesTo(destination) {
        var toReturn = []
        for (let index = 0; index < this.rTable.length; index++) {
            const element = this.rTable[index];
            if (element.dest == destination) {
                toReturn.push(element)
            }
        }
        return toReturn;
    }
    allRoutes() {
        return this.rTable;
    }
}