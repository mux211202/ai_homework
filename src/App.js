import React, {useState} from 'react';
import './App.css';
import {createGameGraph} from "./helpers/graph_helpers";

function App() {
    const [numberOfMatches, setNumberOfMatches] = useState(7); //sērkociņu skaits ar kuru uzsāk spēli
    const [startPlayer, setStartPlayer] = useState(0); // sakuma spēlētājs 0 - lietotājs, 1 - dators
    const [currentGameState, setCurrentGameState] = useState(null); // spēles stāvoklis - virsotne uz kuras tagad ir spele
    const [shownNodes, setShownNodes] = useState([]); // paradītu uz ekrana virsotņu massīvs
    const [isStarted, setIsStarted] = useState(false);//boolean - kurš parada - vai spēle sakusies, vai nē
    const [graph, setGraph] = useState(null);// grafs
    const [activeLevel, setActiveLevel] = useState(1);// aktīvais līmenis - ir izveidots, lai izslēgtu visu augšēju limeņu pogas
    const [gameResult, setGameResult] = useState(false);//spēles rezultāts

    //funkcija uzsāk spēli, izveido grafu un izpilda gājienu, ja spēli uzsāk dators, vai parada sakuma spēles variantus, ja spēli uzsāk lietotājs
    const startGame = (event, numberOfMatches, startPlayer) => {
        event.preventDefault();
        const createdGraph = createGameGraph(numberOfMatches, startPlayer);
        setGraph(createdGraph);
        createdGraph.nodes.sort((a, b) => a.level - b.level);
        setCurrentGameState(createdGraph.nodes[0]);
        if (startPlayer) {
            makeTurn(createdGraph.nodes[0], createdGraph);
        } else {
            showNodeVariants(createdGraph, createdGraph.nodes[0]);
        }
        setIsStarted(true);
    }

    //parada virsotņus uz ekrāna
    const showNodes = (nodes) => {
        setShownNodes([...shownNodes, ...nodes]);
    }

    //parada virsotnes iespējamos variantus uz ekrāna, ja isStart === true, tad parada arī vēcaku virsotni, no kuras izveidojas varianti
    //izmanto showNodes funkciju
    const showNodeVariants = (graph, node, isStart = false) => {
        const edges = graph.getNodeAEdges(node);
        const possibleVariants = [];
        edges.forEach(edge => {
            possibleVariants.push(edge[1].b)
        })
        if (isStart) {
            console.log([[node], [...possibleVariants]])
            showNodes([[node], [...possibleVariants]]);
        } else {
            showNodes( [[...possibleVariants]]);
        }
    }

    //izpilda gajienu, novertē, visus iespējamos variantus, izvēlējas pirmo ar vērtējumu === 1
    //ja nav virsotņu ar vērtējumu 1, tas nozīmē, ka dators nevarēs uzvarēt, ja lietotājs nepieļaus kļūdu, un ši gadījuma dators nejauši izvelas virsotni
    const makeTurn = (selectedNode, graph, isFromSelect = false) => {
        console.log('making turn...')
        const edges = graph.getNodeAEdges(selectedNode);
        const newActiveLevel = isFromSelect ? activeLevel+2 : activeLevel+1;
        if (!edges.length) {
            console.log('YOU WON')
            setGameResult('YOU')
            setActiveLevel(newActiveLevel);
            return;
        }
        setActiveLevel(newActiveLevel);
        const connectedEdge = edges.find(edge => edge[1].b.mark === 1);
        if (connectedEdge) {
            const connectedNode = connectedEdge[1].b;
            showNodeVariants(graph, connectedNode, true);
            setCurrentGameState(connectedNode);
            if (!graph.getNodeAEdges(connectedNode).length) {
                console.log('COMPUTER WON')
                setGameResult('COMPUTER')
            }
        } else {
            const randomNode = edges[Math.floor(Math.random() * (edges.length-1))][1].b;
            showNodeVariants(graph, randomNode, true);
            setCurrentGameState(randomNode);
        }

    }

    //funkcijas izsaucas, kad lietotās spiež uz varianta virsotnes pogu
    const selectVariant = (key) => {
        const selectedNode = graph.findNode(key);
        setCurrentGameState(selectedNode);
        makeTurn(selectedNode, graph, true);
    }

    //izmaina sērkociņu skaitu
    const inputChangeHandler = (event) => {
        setNumberOfMatches(event.target.value);
    }

    //izmaina startPlayer vērtību
    const selectChangeHandler = (event) => {
		setStartPlayer(parseInt(event.target.value));
    }

    return (
        <div>
            <h1>Welcome! Let's play Nims game!</h1>

            <form className="form" onSubmit={(event) => startGame(event, numberOfMatches, startPlayer)}>
                <label>Select the amount of matches</label>
                <input onChange={(e) => inputChangeHandler(e)}
					   type="number" min="7" max="17" value={numberOfMatches}/>
                <label>Select who plays first</label>
                <select onChange={(e) => selectChangeHandler(e)} value={startPlayer}>
                    <option value="0">You</option>
                    <option value="1">Computer</option>
                </select>
                {!isStarted && <button type="submit">Play!</button>}
            </form>

            <div className="nodes">
                {
                    //parada spēles sakuma virsotni
                    graph &&
                    <div className="nodes-level first">
                        <button className="node" disabled
                             onClick={() => selectVariant(graph.nodes[0].key)}
                             key={graph.nodes[0].key}>
                            {graph.nodes[0].key}
                        </button>
                    </div>
                }
                {
                    //parada virsotnes
                    shownNodes.map(levelNodes =>
                        <div className="nodes-level">
                            {levelNodes.map(node =>
                                <button className="node"
                                     onClick={() => selectVariant(node.key)}
                                     disabled={!(node.level === activeLevel)}
                                     key={node.key}>
                                    {node.key}
                                </button>
                            )}
                        </div>
                    )
                }
            </div>
            {
                //parada spēles rezultātu
                gameResult &&
                <div className="result-overlay">
                    <div className="result">
                        {`${gameResult} WON!`}
                    </div>
                    <button className="restart" onClick={()=>window.location.reload()}>Start new game</button>
                </div>
            }
        </div>
    );
}

export default App;
