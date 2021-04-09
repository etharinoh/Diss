export default class Node {
    constructor(name, circle) {
        this.sender = Send;
        this.reciever = Rec;
        this.connectionArr = [];
    }
    constructor(name, circle, arr) {
        this.sender = Send;
        this.reciever = Rec;
        this.connectionArr = arr;
    }
    addConnection(connection){
        this.connectionArr.push(connection);
    }
    
    getConnectionArr(){
        return this.connectionArr;
    }
}