//This is where i create the screen for explaining basic network topologies, their properties with diagrams.
import Navigation from "../../components/navigation"
import "./Topologies.css"

import {ReactComponent as P2P} from '../../assets/Images/Topologies/Topology_Point_To_Point.svg';
import {ReactComponent as Bus} from '../../assets/Images/Topologies/Topology_Bus.svg';
import {ReactComponent as Ring} from '../../assets/Images/Topologies/Topology_Ring.svg';
import {ReactComponent as Hybrid} from '../../assets/Images/Topologies/Topology_Hybrid.svg';
import {ReactComponent as Mesh_Partial} from '../../assets/Images/Topologies/Topology_Mesh_Partial.svg';
import {ReactComponent as Mesh_Full} from '../../assets/Images/Topologies/Topology_Mesh_Full.svg';
import {ReactComponent as Star} from '../../assets/Images/Topologies/Topology_Star.svg';
import {ReactComponent as Tree} from '../../assets/Images/Topologies/Topology_Tree.svg';


const TopologiesBuilder = (props) => (
    <div>
        <Navigation/>
        <div id="Content">
            <h1>Topologies</h1>

            <h2>Point-To-Point</h2>
            <P2P/>
            <h2>Star</h2>
            <Star />

            <h2>Bus</h2>
            <p>This is where there will be one main cable which will act as the spaine for the entire network and each computer will be connected to this main cable.
             If the network has two endpoints it is known as a linear bus topology, one device in the network will act as the computer server.</p>

            <Bus />
            <h2>Ring</h2>
            <Ring />
            <h2>Tree</h2>
            <Tree />
            <h2>Mesh</h2>
            <Mesh_Full />
            <Mesh_Partial/>
            <h2>Hybrid</h2>
            <Hybrid />
        </div>
    </div>
);

export default TopologiesBuilder;