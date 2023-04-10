export class Graph {
	constructor(directed = true) {
		this.directed = directed;
		this.nodes = [];
		this.edges = new Map();
	}

	addNode(key, value = key, level) {
		this.nodes.push({ key, value, level });
	}

	addEdge(a, b, weight) {
		this.edges.set(JSON.stringify({ a, b } ), { a, b, weight });
		if (!this.directed)
			this.edges.set(JSON.stringify([b, a]), { a: b, b: a, weight });
	}

	findNode(key) {
		return this.nodes.find(x => x.key === key);
	}

	getNodeAEdges(node) {
		const found = this.findNode(node.key);
		let newIterable = this.edges.entries(this.edges);
		let newArray = Array.from(newIterable)
		return newArray.filter(edge =>JSON.stringify(edge[1].a) === JSON.stringify(node));
	}

	getNodeBEdges(node) {
		const found = this.findNode(node.key);
		let newIterable = this.edges.entries(this.edges);
		let newArray = Array.from(newIterable)
		return newArray.filter(edge =>JSON.stringify(edge[1].b) === JSON.stringify(node));
	}
}