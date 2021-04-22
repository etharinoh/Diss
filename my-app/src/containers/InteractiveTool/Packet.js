//totalsize, number, header, datasize, object, location, destination, start
export default class Packet{
    constructor(packetNo, size, header, datasize, obj, start, destination){
        this.packetNumber = packetNo;
        this.size = size;
        this.header = header;
        this.dataSize = datasize;
        this.object = obj;
        this.startNode = start;
        this.destinationNode = destination;
    }
}