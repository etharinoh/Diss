//This is where i create the screen for explaining how packet switching is performed with some explanation
import Navigation from "../../components/navigation";

const Circuit = (props) => (
    <div id="Circuit_Parent">
    <h2>Circuit Switching</h2>
    <h3>Phases</h3>
    
    <h3>Advantages</h3>

    <h3>Disadvantages</h3>
    </div>
);

const Packet = (props) => (
    <div id="Packet_Parent">
    <h2>Packet Switching</h2>

    <h3>Datagram Packet Switching</h3>

    <h3>Virtual Circuit Packet Switching (Datagram)</h3>

    <h3>Advantages</h3>

    <h3>Disadvantages</h3>
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