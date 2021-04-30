//This is where i create the screen for explaining basic network topologies, their properties with diagrams.
import Navigation from "../../components/navigation"
import "./Topologies.css"

import { ReactComponent as P2P_Img } from '../../assets/Images/Topologies/Topology_Point_To_Point.svg';
import { ReactComponent as Bus_Img } from '../../assets/Images/Topologies/Topology_Bus.svg';
import { ReactComponent as Ring_Img } from '../../assets/Images/Topologies/Topology_Ring.svg';
import Hybrid_Img from '../../assets/Images/Topology_Hybrid.png';
import { ReactComponent as Mesh_Partial_Img } from '../../assets/Images/Topologies/Topology_Mesh_Partial.svg';
import { ReactComponent as Mesh_Full_Img } from '../../assets/Images/Topologies/Topology_Mesh_Full.svg';
import Star_Img from '../../assets/Images/Topologies_Star.png';
import { ReactComponent as Tree_Img } from '../../assets/Images/Topologies/Topology_Tree.svg';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper, TableBody } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { grey } from "@material-ui/core/colors";

function createData(adv, diss) {
    return { adv, diss };
}

const star = [createData('Easy to troubleshoot and modify', 'If the hub breaks it all breaks'),
createData('Setup is easy and cheap', 'Performance is dependent on hub'),
createData('Good performance with few nodes', ''), createData('Low network traffic', '')];

const bus = [createData('Cost of cable is lower', 'If the common cable fails the whole system does'),
createData('Often for LAN networks because they are cheap and easy', 'If network traffic is high there will be collisions'),
createData('Good for small, simple or temporary networks', 'If there is a lot of traffic or a lot of nodes performance time is decreased.'),
createData('Passive topology, computers on the bus only listen for data and dont have to move it.', 'Cables have limited length')];

const ring = [createData('Easy to install', 'Failure of one computer risks the etnrie network'),
createData('Adding or removing a node is easy.', 'Can be slow in comparison to modern LANs'),
createData('Equal access to all computers', 'Difficult to troubleshoot'),
createData('Fast error checking.', 'Adding or removing disrupts the server for some time.')];

const tree = [createData('One nodes failure does not affect the network', 'Heavily cabled'),
createData('Error detection is easy', 'The more nodes there are the harder it is to maintain'),
createData('Can be easy to maintain', 'If the root hub fails it all fails')];

const mesh = [createData('No data traffic issues as each have a dedicated link.', 'Lots of wires to buy and manage.'),
createData('One link failure will not affect other links', 'Each device would need many I/O ports'),
createData('Point to point so no unauthorised access', 'Issues with scalability as any new device would need to be connected to all others'),
createData('Fault detection is easy', '')];

const hybrid = [createData('Easiest method for error detection', 'Can be complex to design'),
createData('Effective and flexible', 'Can be costly'),
createData('Scalable - easy to increase size.', '')];



const TopologiesBuilder = (props) => (
    <div>
        <Navigation />
        <div className="Content">
            <h1>Topologies</h1>

            <h2>Point-To-Point</h2>
            <P2P_Img />
            
            <p>This is the most basic kind of network that you can have, where a node will have a dedicated connection to another, be it physical or wireless.
            This is the building block which will be used for creating any topology as it is how two nodes are connected.</p>
            <h2>Star</h2>
            <img src={Star_Img} />
            {CreateTable(star)}
            <p>This is one of the basic network topologies where each of the nodes in a network are connected to one central node which is usually a server.
            This can be seen in the diagram above and gets its name from its appearance.</p>
            <h2>Bus</h2>
            <Bus_Img />
            {CreateTable(bus)}
            <p>This is where there will be one main cable which will act as the spaine for the entire network and each computer will be connected to this main cable.
             If the network has two endpoints it is known as a linear bus topology, one device in the network will act as the computer server.</p>

            <h2>Ring</h2>
            <Ring_Img />
            {CreateTable(ring)}
            <p>A ring network is where each device has two neighboring devices and the last node will be connected to the first one, forming a loop or a ring.
             It can be with fixed direction, where there is only one pathway for data to take, or unidirectional.</p>
            <h2>Tree</h2>
            <Tree_Img />
            {CreateTable(tree)}
            <p> This has a root node which all other nodes are connected to form a hierarchy, thus this is known as a hierarchical topology.
             This is a combination of some star topologies on a single bus, hence it can be known as Star Bus topology. </p>
            <h2>Mesh</h2>
            <Mesh_Partial_Img />
            
            <p>Partial Mesh is where most of the nodes are connected Peer to Peer with eachother, but some will only have connections with some others.</p>
            <Mesh_Full_Img />
            <p>Full Mesh is where each node in the network is connected to every other node, through a dedicated point to point link.
            If there are n nodes in a network each will have n-1 connections, thus the number of links would be n(n-1)/2</p>

            {CreateTable(mesh)}
            <h2>Hybrid</h2>
            <p>The hybrid topology is different to the others as this is not a uniquely defined topology itself, as a hybrid topology is the combination
            of any two or more topologies. Due to this fact it means that hybrid topologies would be prone to any advantages and disadvantages of the
             topologies which form them.</p>
            <img src={Hybrid_Img} />
            {CreateTable(hybrid)}
        </div>
    </div>
);
const useStyles = makeStyles({
    table: {
        background: grey[700],
    },
  });

function CreateTable(props) {
    const classes = useStyles();
    return(
        <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Advantages</TableCell>
                            <TableCell>Disadvantages</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.map((row)=> (
                            <TableRow>
                                <TableCell> {row.adv} </TableCell>
                            <TableCell> {row.diss}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
    )
}
export default TopologiesBuilder;