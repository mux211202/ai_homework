import {Graph} from "../Classes/Graph";

export const createGameGraph = (numberOfMatches, startPlayer) => {
    const stateGraph = {
        hello: undefined
    };

    const firstArray = [numberOfMatches];
    let graph = new Graph();
    graph.addNode([0, firstArray[0]].toString(), [0, firstArray[0]], 0);
    stateGraph[0] = firstArray[0];
    divider(firstArray, graph, graph.nodes[0], 0);
    setNodeMarks(graph, startPlayer);

    return graph;
}

const divider = (arr, graph, node, level) => {
    level++;

    for (let i = 0; i < arr.length; i++) {
        const matchPack = arr[i];

        if (matchPack <= 2) {
            if (i === arr.length - 1) return;
            continue;
        }

        numberDivider(matchPack).forEach((pack, j) => {
            const newArr = [...arr];
            newArr.splice(newArr.indexOf(matchPack), 1);
            pack.forEach(elem => newArr.push(elem));
            const sorted = newArr.sort();
            const existed = graph.findNode(sorted.toString());
            if (existed) {
                graph.addEdge(node, existed);
                divider(newArr, graph, existed, level);
            } else {
                graph.addNode(sorted.toString(), sorted, level);
                const lastNode = graph.nodes[graph.nodes.length - 1];
                graph.addEdge(node, lastNode);
                divider(newArr, graph, lastNode, level);
            }
        })
    }
}

const numberDivider = (number) => {
    const result = [];
    for (let j = 1; j <= number / 2; j++) {
        if (j === (number - j)) break;

        result.push([j, (number - j)])
    }
    return result;
}

const parseLevel = (startPlayer, nodeLevel) => {
    let result = '';
    if (startPlayer) {
        result = nodeLevel % 2 ? 'min' : 'max';
    } else {
        result = nodeLevel % 2 ? 'max' : 'min';
    }
    return result;
}

const setNodeMarks = (graph, startPlayer) => {
    graph.nodes.sort((a, b) => b.level - a.level);
    graph.nodes.forEach(node => {
        const parsedLevel = parseLevel(startPlayer, node.level)
        node.parsedLevel = parsedLevel;
        let mark;

        const childNodes = graph.getNodeAEdges(node);
        if (!childNodes.length) {
            mark = parsedLevel === 'max' ? -1 : 1;
        }

        if (childNodes.length === 1) {
            mark = childNodes[0][1].b.mark;
        }

        if (childNodes.length >= 2) {
            let maxValue = -1;
            let minValue = 1;
            childNodes.forEach(childNode => {
                if (childNode[1].b.mark > maxValue) maxValue = childNode[1].b.mark;
                if (childNode[1].b.mark < minValue) minValue = childNode[1].b.mark;
            })
            mark = parsedLevel === 'max' ? maxValue : minValue;
        }

        node.mark = mark;
    })

    console.log(graph.nodes)
}