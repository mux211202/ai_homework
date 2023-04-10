export class Graph {
	constructor(directed = true) {
		this.directed = directed;
		this.nodes = [];
		this.edges = new Map();
	}

	//pievieno jaunu virsotni grafā
	addNode(key, value = key, level) {
		this.nodes.push({ key, value, level });
	}

	//pievieno jaunu zari. parametri: a - sakuma virsotne, b - beigu virsotne
	addEdge(a, b, weight) {
		this.edges.set(JSON.stringify({ a, b } ), { a, b, weight });
		if (!this.directed)
			this.edges.set(JSON.stringify([b, a]), { a: b, b: a, weight });
	}

	//atrada virsotni pēc 'key' paramatra, ja tādas nav, tad atgriež false vērtību
	findNode(key) {
		return this.nodes.find(x => x.key === key);
	}

	//atrod virsotnes zarus, kuras aizved uz virsotnes pēctečiem
	getNodeAEdges(node) {
		let newIterable = this.edges.entries(this.edges);
		let newArray = Array.from(newIterable)
		return newArray.filter(edge =>JSON.stringify(edge[1].a) === JSON.stringify(node));
	}

	//atrod virsotnes zarus, kuras aizved uz virsotnes priekštečiem
	getNodeBEdges(node) {
		let newIterable = this.edges.entries(this.edges);
		let newArray = Array.from(newIterable)
		return newArray.filter(edge =>JSON.stringify(edge[1].b) === JSON.stringify(node));
	}
}