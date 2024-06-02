// global indicators
var deleteMode = {
    value: false
};
var linkMode = {
    value: false
};
// the graph
let nodes = [];
let edges = [];
// Get the list of font faces currently available
var fontList = document.fonts;

// console.log(nodes);
// when in link mode, these will contain the selected nodes
var selectedNode1 = null;
var selectedNode2 = null;
// for servers
var selectedServer=null;

function dijkstra(start_point, url_target)
{
    let visitedNodes = [];
    let unvisitedNodes=[];
    let distances = {};
    let predecessors = {};
    let forwardingTable = {};   // the output

    // Initialization: discpvering the graph and initializing the distances from the startibg node to the other nodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i].name;
        // filling the forwarding table
        forwardingTable[node] = '';
        distances[node] = node === start_point ? 0 : Infinity;
        predecessors[node] = '';
        unvisitedNodes.push(node);
    }
    console.log(nodes);
    console.log(distances);
    console.log(predecessors);
    console.log(forwardingTable);

    // shortest distance search
    while(unvisitedNodes.length > 0)
    {
        // sorting the object to see which node to mark as visited next
        unvisitedNodes.sort((a, b) => distances[a] - distances[b]);

        // getting the next node and its neighbours
        let node = unvisitedNodes[0];
        let node_neighb = findNeighbhours(node);

        // updating the distances of the neighbours from the startting node
        for(var i = 0; i < node_neighb.length; i++)
        {
            let neighb = node_neighb[i][0];
            let neighb_dist = node_neighb[i][1];
            let tmp_dist = distances[node] + neighb_dist;  // tmp_dist = dist(startPoint, node) + dist(node, neighb)
            if(tmp_dist < distances[neighb])
            {
                distances[neighb] = tmp_dist;
                predecessors[neighb] = node;
            }
        }

        // marking the node as visited and thus removing it from the unvisited
        visitedNodes.push(node);
        unvisitedNodes.shift();
    }

    // printing the result
    console.log("----path----")
    console.log(predecessors);
    console.log("----dist----")
    console.log(distances);

    // building the forwarding table
    console.log("--------------starting point-------------");
    console.log(start_point);
    buildTable(start_point, predecessors, forwardingTable);
    console.log("-----------forwarding table-----------------");
    console.log(forwardingTable);
    return forwardingTable;
}

// function that looks for all the neighbours of a given node
function findNeighbhours(nodeName)
{
    let neighb = [];
    for(var i = 0; i < edges.length; i++)
    {
        // if the ID of an edge contains the name of a node, then the other part is a neighbour
        if(edges[i].id.indexOf(nodeName) !== -1)
        {
            // find the other part
            if(edges[i].nodes[0].name === nodeName) // if it is the first node which has the name, then take the other node, and vice versa
            {
                let obj = [edges[i].nodes[1].name, edges[i].weight];
                neighb.push(obj);
            }
            else
            {
                let obj = [edges[i].nodes[0].name, edges[i].weight];
                neighb.push(obj);
            }
        }
    }
    return neighb;
}

// function that builds the forwarding table of a node given the table of predecessors
function buildTable(start_point, predecessors, forwardingTable)
{
    for(var i = 0; i < nodes.length; i++)
    {
        let end_point = nodes[i].name;
        let nextHop = buildPath(start_point, end_point, predecessors);
        // modifying the output port of the start_point no reach end_node
        forwardingTable[end_point] = nextHop;
    }
}

// function that looks for the next node to go to in order to reach a specific node
function buildPath(start_point, end_point, predecessors)
{
    let predecessor = end_point;
    let nextHop = end_point;
    // finding the path from the end_point to the start_point
    while(predecessor !== start_point)
    {
        // storing the next node
        nextHop = predecessor;
        // going backward until reaching the start_point
        predecessor = predecessors[predecessor];
    }
    
    // returning the nextHop to reach end_point
    console.log("-----ilay haverina: ", nextHop);
    console.log("----- input port-n'io: ", predecessor);
    return nextHop;
}

// function that verifies if a service is available in a server
function findLink(url, node)
{
    if (node.services.includes(url))
    {
        return true;
    }
    else
    {
        return false;
    }
}

// function that searches for the node of a certain name
function findNode(nodeName)
{
    for(var i = 0; i < nodes.length; i++)
    {
        if(nodes[i].name === nodeName)
        {
            return i;
        }
    }
}