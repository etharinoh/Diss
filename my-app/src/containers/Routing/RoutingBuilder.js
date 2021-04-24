//This is where i create the screen for explaining basic routing methods, their properties with diagrams.
import Navigation from "../../components/navigation"

const DistanceVector = (props) => (
    <div id="DV_Parent">
        <h2>Distance Vector</h2>
        <h3>Theory</h3>
        <p>This is a dynamic routing protocol which uses the principle of Bellman-Ford’s algorithm. This is what is used in the real world by modern
        routers to create a routing table allowing the shortest path to be determined through the network. This is done by all routers being informed
 on each other router in their network and will update their routing table when needed.</p>

        <h3>How its done</h3>
        <p>In this similar to Dijkstra's the network would be considered as a weighted graph to which the connections between these paths have an
        associated weight or cost. These costs is stored in the table for each node, where itself has a cost of 0, any unconnected node is set to
        infinity and each neighboring router is step to one.
</p>
        <p>One is used as the algorithm considers the hop count for a network, the number of networks that need to be changed through to reach
        the destination node. As soon as one node updates its routing table then another router will take their values and update and forward
        their table to all their connected nodes. These are stored as the distance network, the cost and where to hop to, meaning that assuming all
 router tables are updated and correct any path can be taken.</p>
        <h3>Advantages</h3>
        <li>Easy to implement for smaller networks
</li>
        <li>Low amount of redundancy, for smaller networks</li>
        <h3>Disadvantages</h3>
        <li>In larger networks the time that it takes a router to produce an accurate routing table can be large and take too much time
        (convergence time)
</li>
        <li>The propagation of routing table updates can cause unnecessary traffic on the network</li>

        
    </div>
);

const Dijkstra = (props) => (
    <div id="Dijk_Parent">
        <h2>Dijkstra's Algorithm</h2>
        <h3>Theory</h3>
        <p>This algorithm was published by Edsger Dijkstra, a Dutch Computer scientist in 1959.This is a routing algorithm for finding the shortest
        path between two nodes in a weighted graph (or network), which can either be directed or undirected. However it is important to note that
    the graph needs to have a weight for every edge for it to work.</p>

        <h3>How its done</h3>
        <p>This is done by starting by creating a table (array) to store the distances from the source node to each other node in the graph,
        each unknown node is set to infinity by default. There is also a queue, Q, of each of the nodes in the graph, which by the end will be empty,
        and inversely a set ,S, which will contain all the visited nodes in the graph.
</p>
        <p>
            From here while there are still nodes which have not been visited, those in Q which are not yet in S. Check those that have the smallest
distance value from starting node <i> s </i>, add the visited node to S from Q and update its distance value in the table.
Then this will proceed with the next lowest value which still hasn't been visited from the distance table.</p>
        <h3>Advantages</h3>
        <ul>
            <li>Almost linear complexity (very simple)</li>
            <li>Once completed you also have the shortest path to every other node in the graph</li>
        </ul>
        <h3>Disadvantages</h3>
        <li>Cannot handle negative edges</li>
        <li>Struggles with accuracy in the presence of cycles</li>
    </div>
);

const RoutingBuilder = (props) => (
    <div>
        <Navigation />
        <div className="Content">
            <h1>Routing</h1>
            <h2>What is a routing algorithm? & Why do we need them?</h2>
            <p>Simply put a routing algorithm is something which finds a route or path between a source and destination. Many of these algorithms
            are optimised due to different parameters but the most common is finding the best path (with least cost). This is particularly
            important when thinking about performing switching across a network as it means that for certain methods such as Circuit switching
             and Virtual circuit switching to know the route that the message / packets must be sent along.</p>

            <Dijkstra />
            <DistanceVector />

        </div>
    </div>
);

export default RoutingBuilder;