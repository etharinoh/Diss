export default class Connection{
    inUse;
    constructor(from, to , line){
            this.fromNode = from;
            this.toNode = to;
            this.connectorObj = line;
            this.inUse = false;
    }
    use(){
        this.inUse = true;
    }
    finished(){
        this.inUse = false;
    }

}