//This is where i create the screen for explaining basic routing methods, their properties with diagrams.
import Navigation from "../../components/navigation"
import "./Routing.css"
import DV_Step1 from "../../assets/Images/DV_Examples/DV_Example_S1.png"
import DV_Step2 from "../../assets/Images/DV_Examples/DV_Example_S2.png"
import DV_Step3 from "../../assets/Images/DV_Examples/DV_Example_S3.png"
import DV_Step4 from "../../assets/Images/DV_Examples/DV_Example_S4.png"

import DJ_Step1 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S1.png"
import DJ_Step2 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S2.png"
import DJ_Step3 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S3.png"
import DJ_Step4 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S4.png"
import DJ_Step5 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S5.png"
import DJ_Step6 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S6.png"
import DJ_Step7 from "../../assets/Images/Dijkstra_Examples/DJ_Example_S7.png"

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
        <h3>Examples</h3>
        <p><b>Step One:</b> Each node looks at the connections that it has and puts them into its routing table.</p>
        <img src={DV_Step1} class="Example" />
        <p><b>Step Two:</b> In this we can see that node Y gets the routing tabel from X and updates its routing table accordingly.
In this we can see that it has replaced its shorteest route to z from 8 to 5, which is taken from travelling to X then Z</p>
        <img src={DV_Step2} class="Example" />
        <p><b>Step Three:</b> The same from step 2 is completed at Node Y for the routing table from node Z</p>
        <img src={DV_Step3} class="Example" />
        <p><b>Final:</b> The routing table is updated for each node so each know the best path</p>
        <img src={DV_Step4} class="Example" />
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
        <h3>Example</h3>
        <p>1. In the first step below we select that node A wil be the start node, at the bottom you can see the set of all of the unvisited nodes
        then a table on the right hand side displaying the shortest route to each node</p>
        <img src={DJ_Step1} class="Dijkstra" />
        <p>2. Here we can see that from A there are two connections that we can follow, to B which will have a weight of 1 or to C with a weight of 3</p>
        <img src={DJ_Step2} class="Dijkstra" />
        <p>3. From this we chose to follow the path to B as it has the lower weight, at this point we can take B out of the queue of unvisited nodes,
        and add the connection to D to the distance table with a weight of 1 from A to B then 4 from B to D</p>
        <img src={DJ_Step3} class="Dijkstra" />
        <p>4. We then repeat the above steps which will then take us to Node C and add the new distances for D and E to the table. However as a shorter path
         to D was found before we will not change it.</p>
        <img src={DJ_Step4} class="Dijkstra" />
        <p>5. Here we had the choice to either follow the path to E or D as they both have a distance of 5, for this we will chose to visit Node E.</p>
        <img src={DJ_Step5} class="Dijkstra" />
        <p>6. This gives us a value for the path to F of 7 but we still need to check if there is a shorter one, therefore we go to D</p>
        <img src={DJ_Step6} class="Dijkstra" />
        <p>7. Finally we can see all nodes have been visited and found that the path A,C,E,F is the shortest path with a total weight of 7. However we also now have the shortest path to each node from A</p>
        <img src={DJ_Step7} class="Dijkstra" />
        <h3>Advantages</h3>
        <ul>
            <li>Almost linear complexity (very simple)</li>
            <li>Once completed you also have the shortest path to every other node in the graph</li>
        </ul>
        <h3>Disadvantages</h3>
        <ul>
            <li>Cannot handle negative edges</li>
            <li>Struggles with accuracy in the presence of cycles</li></ul>
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