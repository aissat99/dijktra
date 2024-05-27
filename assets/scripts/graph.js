// a node class
class Node {
    constructor(nodeName="Node", shapeImage="assets/img/server.png") {
        // var stagePos = stage.getAbsolutePosition();
        this.name = nodeName;
        // ------server simulations---------
        this.services=[];
        this.state =  false;     // to set the server active or not
        this.socket = io('http://localhost:3000');

        this.id = 0;    // used to identify the server on the network
        // handle socket event
        this.socket.on('connect', () => {
            this.id = this.socket.id;
            console.log("The ID of the server: ", this.id);
        });
        // this.socket.disconnect();   // not active be default
        // ------------------------------------------
        this.iconPath=shapeImage;
        this.gui = new Konva.Group({
            // x: 30,
            // y: 30/* + stage.height() / 2,*/
        });
        this.shape = new Konva.Image({
            x:0,
            y:20,
            width: 30,
            height: 40
        });
        this.display_name = new Konva.Text({
            x:0,
            y:0,
            text: nodeName,
            fontSize: text_style.size,
            fontStyle: text_style.style,
            fontFamily: text_style.font_family,
            fill: text_style.color,
        })
    // properties
        // this.gui.add(this.shape);
        this.gui.add(this.display_name);
        layer.add(this.gui);
        this.shape.draggable(true);
        console.log(this.id);
    }
    // activate/deactivate the server
    startServer()
    {
        this.socket.connect();
        console.log("Server "+this.id+" started");
    }
    stopServer()
    {
        this.socket.disconnect();
        console.log("Server "+this.id+"  stopped");
    }
}

class Edge {
    constructor(id, node1, node2, weight){
        this.name = [node1.name, node2.name];
        this.id = id;
        this.nodes = [node1, node2];
        this.weight = weight;
        this.shape = new Konva.Line({
            points: [node1.shape.x()+node1.shape.width()+5, node1.shape.y()+node1.shape.height()/2, node2.shape.x()-5, node2.shape.y()+node2.shape.height()/2],
            strokeWidth: 4,
            stroke: 'black'
        });
        this.display_weight = new Konva.Text({
            x: node1.shape.x()+40,
            y: node1.shape.y() - 30,
            text: this.weight,
            fontSize: text_style.size,
            fontStyle: text_style.style,
            fontFamily: text_style.font_family,
            fill: text_style.color,
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
    var img = new Image();
    img.onload= function(){
        new_node.shape.image(img);
        new_node.gui.add(new_node.shape);
    }
    img.src = new_node.iconPath;
    // nodes.push(new_node);    // nodes will be added manually wether a server is active or not
    // console.log(nodes);
    new_node.shape.on('dragmove', function() {
        // constrain the position of the element withn the stage
        constrainObjectPosition(new_node.shape);
        // position of the text
        new_node.display_name.position({
            x: new_node.shape.x(), // Offset by 10 pixels horizontally
            y: new_node.shape.y() - 20  // Offset by 30 pixels vertically
        });
        // position of the edges
        updateEdgePositions();
        layer.batchDraw();
    });
    // events on the node
    new_node.gui.on('click', function(event){
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
                showAddForm("weight_prompt");
                // exit the link mode
                linkMode.value = false;
            }
        }
        else
        {
            // if not in selecting mode, unselect any node to prevent unintended links to be created
            selectedNode1 = null;
            selectedNode2 = null;
            selectedServer = new_node;
            showAddForm("add_url_prompt");
            var title = "Services available in: "+new_node.name;
            var state = new_node.state === true?'Deactivate server':'Activate server';
            document.getElementById("server_title").innerText=title;
            document.getElementById('changeState').innerHTML = state;
        }
    });
    // removing the form when a node is added
    var element = document.getElementById('add_node_prompt');
    element.style.display = 'none';
}

// function that fetches all the url in a node and gives it to the front
function updateUrlList(server)
{
    // refresh the list of services in the front
    var p = document.getElementById("url_list");
    p.innerHTML = '';
    var url_list = server.services;
    for(var i = 0; i < url_list.length; i++)
    {
        p.innerHTML += url_list[i]+'<br /><br />';
    }
}
// add an url to a server
function addUrl(event, url)
{
    event.preventDefault();
    deleteMode.value = false;
    linkMode.value = false;
    // element = document.getElementById("add_url_prompt");
    // element.style.display = 'none';
    // refresh the list of urls of the selected server
    selectedServer.services.push(url);
    updateUrlList(selectedServer);
}

/// Link 2 nodes
function linkNodes(node1, node2, weight)
{
    deleteMode.value = false;
    linkMode.value = false;
    // link the nodes with an edge
    var edge = new Edge(node1.name+"_"+node2.name, node1, node2, weight);
    edges.push(edge);
    // gui
    edge.shape.on('click', function(){
        if(deleteMode.value === true)
        {
            deleteEdge(edges, edge.id);
        }
    });
    // prompting the edge weight form
    layer.draw();
}

function addWeight(event)
{
    event.preventDefault();
    deleteMode.value = false;
    linkMode.value = false;
    element = document.getElementById("weight_prompt");
    element.style.display = 'none';
    var weight_value = Number(document.getElementById("weight").value);
    linkNodes(selectedNode1, selectedNode2, weight_value);
    // restore the values for a future writing
    selectedNode1 = null;
    selectedNode2 = null;
}

/// delete nodes
function deleteNode(obj, value)
{
    for(var i =0; i < obj.length; i++)
    {
        if(obj[i].name === value)
        {
            console.log("found "+value+" in the nodes");
            obj[i].gui.destroy();
            obj.splice(i, 1); // removing the node from the graph
            i--;
        }
    }
    deleteMode.value = false;
    linkMode.value = false;
}

/// delete edges
function deleteEdge(obj, value)
{
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
    }
    deleteMode.value = false;
    linkMode.value = false;
}