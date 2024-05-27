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

    // Initialization
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i].name;
        distances[node] = node === start_point ? 0 : Infinity;
        predecessors[node] = '';
        unvisitedNodes.push(node);
    }
    console.log(distances);
    console.log(predecessors);

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

    // updating the UI
    let end_point = searchPath(url_target, distances);
    let nextHop = buildPath(start_point, end_point, predecessors);    // this will color the edges
    return nextHop;
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

function findLink(url, node)
{
    if (node.services.includes(url))
    {
        return true;
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

function searchPath(target, paths)
{
    var shortestDistance = Infinity;
    let goalNode = null;
    // loop over the paths to look for the link
    for(let server in paths)
    {
        // getting the node
        let index = findNode(server);
        let node = nodes[index];
        // then see if the link belongs to the server
        if(findLink(target, node))
        {
            // comparing distances to see if a shorter path is available
            let dist = paths[server];
            if(dist < shortestDistance)
            {
                shortestDistance = dist;
                goalNode = server;
            }
        }
    }
    return goalNode;
}

function buildPath(start_point, end_point, predecessors)
{
    let edgesIDs = [];
    let predecessor = end_point;
    while(predecessor !== start_point)
    {
        // adding an edge to color
        let id1 = predecessor+'_'+predecessors[predecessor];
        let id2 = predecessors[predecessor]+'_'+predecessor;    // needed in case the id is written the other way
        edgesIDs.push(id1);
        edgesIDs.push(id2);
        // going backward until reaching the start_point
        predecessor = predecessors[predecessor];
    }
    console.log(edgesIDs);
    // style: coloring the node
    for(var i = 0; i < nodes.length; i++)
    {
        let node = nodes[i];
        if(nodes[i].name === start_point)
        {
            node.display_name.fill(highlight_color);
        }
        else
        {
            node.display_name.fill(text_style.color);
        }
    }
    
    // style: coloring the edges
    for(var i = 0; i < edges.length; i++)
    {
        var id = edges[i].id;
        var edge = edges[i];
        if(edgesIDs.includes(id))
        {
            console.log("done");
            edge.shape.stroke(highlight_color);
            edge.display_weight.fill(highlight_color);
        }
        else
        {
            edge.shape.stroke(text_style.color);
            edge.display_weight.fill(text_style.color);
        }
    }
    layer.draw();
}