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

	removeNode(key) {
		this.nodes = this.nodes.filter(n => n.key !== key);
		[...this.edges.values()].forEach(({ a, b }) => {
			if (a === key || b === key) this.edges.delete(JSON.stringify([a, b]));
		});
	}

	removeEdge(a, b) {
		this.edges.delete(JSON.stringify([a, b]));
		if (!this.directed) this.edges.delete(JSON.stringify([b, a]));
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

	hasEdge(a, b) {
		return this.edges.has(JSON.stringify([a, b]));
	}

	setEdgeWeight(a, b, weight) {
		this.edges.set(JSON.stringify([a, b]), { a, b, weight });
		if (!this.directed)
			this.edges.set(JSON.stringify([b, a]), { a: b, b: a, weight });
	}

	getEdgeWeight(a, b) {
		return this.edges.get(JSON.stringify([a, b])).weight;
	}

	adjacent(key) {
		return [...this.edges.values()].reduce((acc, { a, b }) => {
			if (a === key) acc.push(b);
			return acc;
		}, []);
	}

	indegree(key) {
		return [...this.edges.values()].reduce((acc, { a, b }) => {
			if (b === key) acc++;
			return acc;
		}, 0);
	}

	outdegree(key) {
		return [...this.edges.values()].reduce((acc, { a, b }) => {
			if (a === key) acc++;
			return acc;
		}, 0);
	}
}