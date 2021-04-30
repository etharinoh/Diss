//size, object, name, location, route, destination, start
export default class Message{
    constructor(Name, msgObject, Start, Destination ){
            this.name = Name;
            this.object = msgObject;
            this.startNode = Start;
            this.destinationNode = Destination;
    }

}