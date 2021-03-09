//This is where i create the screen for explaining how packet switching is performed with some explanation
import Navigation from "../../components/navigation";

const Circuit = (props) => (
    <div id="Circuit_Parent">
    <h1>Circuit Switching</h1>
    <p>Circuit switching is a connection oriented switching method and is the basis of ordinary telephone calls. 
        This is where there are a sender and receiver which have a dedicated route created between them to allow communication. 
        Due to this it is required to create this route between the two nodes and thus some routing algorithm is needed, as can be seen in the routing section of the website.
    </p>
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

    <h2>Disadvantages</h2>
    </div>
);

const Packet = (props) => (
    <div id="Packet_Parent">
    <h1>Packet Switching</h1>

    <h2>Datagram Packet Switching</h2>

    <h2>Virtual Circuit Packet Switching (Datagram)</h2>

    <h2>Advantages</h2>

    <h2>Disadvantages</h2>
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