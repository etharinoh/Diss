export default class Node {
    constructor(name, circle) {
        this.name = name;
        this.circleObject = circle;
        this.connectionArr = [];
        this.packetQueue = [];
        this.inUse =false;
    }
    addConnection(connection){
        this.connectionArr.push(connection);
    }
    
    use(){
        this.inUse = true;
    }
    finished(){
        this.inUse = false;
    }
    getConnectionArr(){
        return this.connectionArr;
    }

    enqueue(toAdd){
        console.log(toAdd, 'enqueue', this.packetQueue)
        this.packetQueue.push(toAdd);
    }
    dequeue(){
        this.packetQueue.shift()
        var removed = this.packetQueue.shift();
        console.log(removed, 'dequeue')
    }
    isEmpty(){
        return this.packetQueue.length == 0;
    }
}