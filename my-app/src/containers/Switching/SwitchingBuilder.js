//This is where i create the screen for explaining how packet switching is performed with some explanation
import Navigation from "../../components/navigation";
import { ReactComponent as Circuit_Img } from '../../assets/Images/Switching/Switching_Circuit.svg';
import Packet_Img  from '../../assets/Images/Switching_Packet.png';



const Circuit = (props) => (
    <div id="Circuit_Parent">
        <h1>Circuit Switching</h1>
        <p>Circuit switching is a connection oriented switching method and is the basis of ordinary telephone calls.
        This is where there are a sender and receiver which have a dedicated route created between them to allow communication.
        Due to this it is required to create this route between the two nodes and thus some routing algorithm is needed, as can be seen in the routing section of the website.
    </p>
        <Circuit_Img />
        <h2>Phases</h2>
        <p> There are three phases that break up the circuit switching method:
        <ul>
                <li><b>Circuit Establishment: </b>This is the first phase where the connection between the two nodes is created. This is where the previously mentioned routing algorithm would be used to ensure that
                 there is a dedicated connection between the, which should find the best path to according to some algorithm. Additionally a part of this is to send a requires with
                  corresponding acknowledge to ensure that the two devices have been connected.
            </li>
                <li><b>Data Transfer: </b>This is the second phase where the dedicated communication channel is actually used, the data will be sent whole along the communication channel from
                sender to receiver.
            </li>
                <li><b>Circuit Disconnect: </b>The final phase of this is to deconstruct the circuit that has been established. This can be initiated by either the sender or the receiver can start to tell each of
                 the nodes to disconnect the connection between them.</li>
            </ul>
        </p>
        <h2>Advantages</h2>
        <ul>
            <li>
                Good for long transmissions where a dedicated connection is required to remain through the conversation
    </li>
            <li>
                Preferable when a steady transmission rate is required
    </li>
            <li>
                Real-time communication can be done once the connection is established, no delay after setup.
    </li>
        </ul>
        <h2>Disadvantages</h2>
    </div>
);

const Packet = (props) => (
    <div id="Packet_Parent">
        <h1>Packet Switching</h1>
        <p>This is the method of breaking down the data into smaller variable size packets for sending, then once arriving at the destination they can be reassembled
        creating the file that has been sent. A packet has a payload and control information, this uses Store and Forward technique,
        store the packet then forward. This is the best for small data.
</p>
        <img src={Packet_Img} />
        <h2>Datagram Packet Switching</h2>
        <p>In this each packet can move independently, they will contain all necessary addressing information such as source address, destination address and
        port numbers. Packets can take different routes so when they arrive they could not be in the correct order, there is no connection or
        teardown phase so decisions are made dynamically. Packet delivery is not guaranteed so reliability is provided by end systems.
        Packets will have id so that they can be rebuilt.
</p>
        <h2>Virtual Circuit Packet Switching (Datagram)</h2>
        <p>Similar to circuit switching there are 3 phases, setup phase, data transfer phase and tear down phase. For this there will be a logical path created
        through the network and the data will follow this route from sender to receiver. This will create a virtual circuit id for each node and then send
        the data across the created path.
</p>
        <p><b>Setup</b> - Before a connection or virtual circuit can be used it must be established between 2 or more nodes by using call setup.</p>
        <p><b>Data Transfer Phase</b> - This is where the data is actually sent in packets in a stream, they will each have headers that will contain length,
 timestamp and sequence number. They will then be sent in a datastream.
</p>
        <p><b>Teardown</b> - This is where the virtual connection will be removed</p>
        <h2>Advantages</h2>
        <ul>
            <li>Packets can travel independently, reducing delay
</li>
            <li>Doesn't waste bandwidth as multiple transfers can use the same links</li>

        </ul>
        <h2>Disadvantages</h2>
        <ul>
            <li>More complex protocols are required which can lead to errors in packets, thus delay in delivery
</li>
            <li>Unsuitable when information is needed in high quality or realtime
</li>
        </ul>
    </div>
);

const SwitchingBuilder = (props) => (
    <div>
        <Navigation />
        <div className="Content">
            <Circuit />
            <Packet />
        </div>
    </div>
);

export default SwitchingBuilder;