//This is where i create the screen for explaining basic routing methods, their properties with diagrams.
import Navigation from "../../components/navigation"

const DistanceVector = (props) => (
    <div id="DV_Parent">
    <h2>Distance Vector</h2>
    <h3>Theory</h3>

    <h3>Pseudocode</h3>

    <h3>Example</h3>

    <h3>Advantages</h3>

    <h3>Disadvantages</h3>
    </div>
);

const Dijkstra = (props) => (
    <div id="Dijk_Parent">
        <h2>Dijkstra's Algorithm</h2>
        <h3>Theory</h3>

        <h3>Pseudocode</h3>

        <h3>Example</h3>

        <h3>Advantages</h3>

        <h3>Disadvantages</h3>

        
    </div>
);

const RoutingBuilder = (props) => (
    <div>
        <Navigation/>
        <div className="Content">
            <h1>Routing</h1>
            <h2>What is a routing algorithm?</h2>

            <h2>Why do we need them?</h2>

            <Dijkstra />
            <DistanceVector />
        
        </div>
    </div>
);

export default RoutingBuilder;