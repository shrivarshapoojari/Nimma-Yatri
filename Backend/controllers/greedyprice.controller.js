

function findLongestNavigablePath(pairs) {
    let graph = new Map();
    let inDegree = new Map();
    let startingPoints = new Set();

    // Step 1: Build graph and track in-degrees
    for (let [pickup, destination] of pairs) {
        if (!graph.has(pickup)) graph.set(pickup, []);
        graph.get(pickup).push(destination);

        inDegree.set(destination, (inDegree.get(destination) || 0) + 1);
        if (!inDegree.has(pickup)) inDegree.set(pickup, 0);
    }

    // Step 2: Identify starting points (nodes with in-degree 0)
    for (let [pickup] of graph) {
        if (inDegree.get(pickup) === 0) {
            startingPoints.add(pickup);
        }
    }

    let longestPath = [];

    // Step 3: DFS to find the longest path
    function dfs(node, path) {
        if (!graph.has(node)) {
            if (path.length > longestPath.length) {
                longestPath = [...path];
            }
            return;
        }
        for (let nextNode of graph.get(node)) {
            dfs(nextNode, [...path, nextNode]);
        }
    }

    // Step 4: Start DFS from all possible starting points
    for (let start of startingPoints) {
        dfs(start, [start]);
    }

    return longestPath;
}

const pairs = [
    ["a", "b"],
    ["b", "c"],
    ["c", "d"],
    ["d", "e"],
    ["x", "y"] // Disconnected route
];

 const path = findLongestNavigablePath(pairs);

 console.log(path);
 
