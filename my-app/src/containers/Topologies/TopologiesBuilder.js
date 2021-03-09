//This is where i create the screen for explaining basic network topologies, their properties with diagrams.
import Navigation from "../../components/navigation"
import "./Topologies.css"

import {ReactComponent as P2P_Img} from '../../assets/Images/Topologies/Topology_Point_To_Point.svg';
import {ReactComponent as Bus_Img} from '../../assets/Images/Topologies/Topology_Bus.svg';
import {ReactComponent as Ring_Img} from '../../assets/Images/Topologies/Topology_Ring.svg';
import {ReactComponent as Hybrid_Img} from '../../assets/Images/Topologies/Topology_Hybrid.svg';
import {ReactComponent as Mesh_Partial_Img} from '../../assets/Images/Topologies/Topology_Mesh_Partial.svg';
import {ReactComponent as Mesh_Full_Img} from '../../assets/Images/Topologies/Topology_Mesh_Full.svg';
import {ReactComponent as Star_Img} from '../../assets/Images/Topologies/Topology_Star.svg';
import {ReactComponent as Tree_Img} from '../../assets/Images/Topologies/Topology_Tree.svg';


const TopologiesBuilder = (props) => (
    <div>
        <Navigation/>
        <div className="Content">
            <h1>Topologies</h1>

            <h2>Point-To-Point</h2>
            <P2P_Img/>
            <p>This is the most basic kind of network that you can have, where a node will have a dedicated connection to another, be it physical or wireless. 
            This is the building block which will be used for creating any topology as it is how two nodes are connected.</p>
            <h2>Star</h2>
            <Star_Img />
            <p>This is one of the basic network topologies where each of the nodes in a network are connected to one central node which is usually a server.
            This can be seen in the diagram above and gets its name from its appearance.</p>
            <h2>Bus</h2>
            <Bus_Img />
            <p>This is where there will be one main cable which will act as the spaine for the entire network and each computer will be connected to this main cable.
             If the network has two endpoints it is known as a linear bus topology, one device in the network will act as the computer server.</p>

            <h2>Ring</h2>
            <Ring_Img />
            <p>A ring network is where each device has two neighboring devices and the last node will be connected to the first one, forming a loop or a ring.
             It can be with fixed direction, where there is only one pathway for data to take, or unidirectional.</p>
            <h2>Tree</h2>
            <Tree_Img />
            <p> This has a root node which all other nodes are connected to form a hierarchy, thus this is known as a hierarchical topology.
             This is a combination of some star topologies on a single bus, hence it can be known as Star Bus topology. </p>
            <h2>Mesh</h2>
            <Mesh_Partial_Img/>
            <p>Partial Mesh is where most of the nodes are connected Peer to Peer with eachother, but some will only have connections with some others.</p>
            <Mesh_Full_Img />
            <p>Full Mesh is where each node in the network is connected to every other node, through a dedicated point to point link. 
            If there are n nodes in a network each will have n-1 connections, thus the number of links would be n(n-1)/2</p>
            
            
            <h2>Hybrid</h2>
            <Hybrid_Img />
        </div>
    </div>
);

export default TopologiesBuilder;