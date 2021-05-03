/**
 * Class object for defining a packet
 */
export default class Packet{
    constructor(packetNo, size, header, datasize, obj, start, destination, total){
        this.packetNumber = packetNo;
        this.size = size;
        this.header = header;
        this.dataSize = datasize;
        this.object = obj;
        this.startNode = start;
        this.destinationNode = destination;
        this.totalPackets = total;
    }
}