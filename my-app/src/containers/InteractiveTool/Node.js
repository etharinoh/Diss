export default class Node {
    constructor(name, circle) {
        this.name = name;
        this.circleObject = circle;
        this.connectionArr = [];
        this.packetQueue = [];
    }
    addConnection(connection){
        this.connectionArr.push(connection);
    }
    
    getConnectionArr(){
        return this.connectionArr;
    }

    enqueue(toAdd){
        this.packetQueue.push(toAdd);
    }
    dequeue(){
        this.packetQueue.shift();
    }
    isEmpty(){
        return this.packetQueue.length == 0;
    }
}