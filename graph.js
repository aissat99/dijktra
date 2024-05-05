// a node class
class Node {
    constructor(nodeName="Node", neighbours=null, shapeImage="") {
        var stagePos = stage.getAbsolutePosition();
        this.name = nodeName;
        this.neighbours = [neighbours];
        this.gui = new Konva.Group({
            x: stagePos.x+100,
            y: stagePos.y+75/* + stage.height() / 2,*/
        });
        this.shape = new Konva.Circle({
            x: stagePos.x+100,
            y: stagePos.y+75,/* + stage.height() / 2,*/
            radius: 30,
            fill: '#00215E',
            stroke: 'black',
            strokeWidth: 2
        });
        this.display_name = new Konva.Text({
            x: stagePos.x+100,
            y: stagePos.y+75,/* + stage.height() / 2,*/
            text: nodeName,
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'green',
        })
    // properties
        this.gui.add(this.shape);
        this.gui.add(this.display_name);
        layer.add(this.gui);
        this.shape.draggable(true);

    }
}

class Edge {
    constructor(id, node1, node2, weight){
        this.name = [node1.name, node2.name];
        this.id = id;
        this.nodes = [node1, node2];
        this.weight = weight;
        this.shape = new Konva.Line({
            points: [node1.shape.x(), node1.shape.y(), node2.shape.x(), node2.shape.y()],
            strokeWidth: 4,
            stroke: 'black'
        });
        this.display_weight = new Konva.Text({
            x: this.shape.x / 2,
            y: this.shape.y - 65,
            text: this.weight,
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'green',
        })
        // linking the edge to both groups, such that modification of either group will affect the edge
        layer.add(this.shape);
        layer.add(this.display_weight);
    }
}


/// operations
/// add a node to the graph
function addNode(event)
{
    event.preventDefault();
    deleteMode.value = false;
    linkMode.value = false;
    let node_name = document.getElementById('node_name').value;
    let new_node = new Node(node_name);
    nodes.push(new_node);
    console.log("---------------");
    console.log(new_node.shape.position());
    // console.log(nodes);
    new_node.shape.on('dragmove', function() {
        // constrain the position of the element withn the stage
        constrainObjectPosition(new_node.shape);
        // position of the text
        new_node.display_name.position({
            x: new_node.shape.x() - 30, // Offset by 10 pixels horizontally
            y: new_node.shape.y() - 65  // Offset by 30 pixels vertically
        });
        // position of the edges
        updateEdgePositions();
        layer.batchDraw();
    });
    // events on the node
    new_node.gui.on('click', function(){
        //console.log(new_node.name);
        //console.log(deleteMode.value);
        if(deleteMode.value === true)
        {
            var name = new_node.name;
            deleteNode(nodes, name);
            deleteEdge(edges, name);
            linkMode.value = false;
            // if not in selecting mode, unselect any node to prevent unintended links to be created
            selectedNode1 = null;
            selectedNode2 = null;
            //console.log(nodes)
        }
        else if(linkMode.value === true)
        {
            element = document.getElementById("weight_form");
            // console.log(element.style.display);
            if(selectedNode1 === null)
            {
                selectedNode1 = new_node;
            }
            else
            {
                selectedNode2 = new_node;
                selectedNode1.neighbours.push(selectedNode2);
                selectedNode2.neighbours.push(selectedNode1);
                // console.log(selectedNode1.neighbours);
                // console.log(selectedNode2.neighbours);
                showAddForm("weight_form");
                console.log("=------------------------------------=");
                // exit the link mode
                linkMode.value = false;
            }
        }
        else
        {
            // if not in selecting mode, unselect any node to prevent unintended links to be created
            selectedNode1 = null;
            selectedNode2 = null;
        }
    });
    // removing the form when a node is added
    var element = document.getElementById('add_node_form');
    element.style.display = 'none';
}

/// Link 2 nodes
function linkNodes(node1, node2, weight)
{
    deleteMode.value = false;
    linkMode.value = false;
    var edge = new Edge(node1.name+"_"+node2.name, node1, node2, weight);
    // gui
    edge.shape.on('click', function(){
        if(deleteMode.value === true)
        {
            deleteEdge(edges, edge.id);
        }
    });
    edges.push(edge);
    // prompting the edge weight form
    // some other code to ask for the distance
    layer.draw();
}

function addWeight(event)
{
    event.preventDefault();
    deleteMode.value = false;
    linkMode.value = false;
    element = document.getElementById("weight_form");
    element.style.display = 'none';
    var weight_value = document.getElementById("weight").value;
    console.log(weight_value);
    linkNodes(selectedNode1, selectedNode2, weight_value);
    // restore the values for a future writing
    selectedNode1 = null;
    selectedNode2 = null;
}

/// delete nodes
function deleteNode(obj, value)
{
    console.log("------------------------>"+obj.length);
    for(var i =0; i < obj.length; i++)
    {
        if(obj[i].name === value)
        {
            console.log("found "+value+" in the nodes");
            obj[i].gui.destroy();
            obj.splice(i, 1); // removing the node from the graph
            i--;
        }
        else{
            console.log("nope");
        }
    }
    deleteMode.value = false;
    linkMode.value = false;
}

/// delete edges
function deleteEdge(obj, value)
{
    console.log("----------------------->"+obj.length);
    var i = 0;
    for(i = 0; i < obj.length; i++)
    {
        if(obj[i].id.indexOf(value) !== -1)
        {
            console.log("found "+value+" in the edges");
            obj[i].shape.destroy();
            obj[i].display_weight.destroy();
            obj.splice(i, 1); // removing the edge from the graph
            i--;
        }
        else
        {
            console.log("nope");
        }
    }
    deleteMode.value = false;
    linkMode.value = false;
}