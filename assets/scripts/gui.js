// text style properties
var text_style = {
    size:15,
    font_family:'Calibri',
    color:'#32012F',
    style:'bold'
}

var highlight_color = '#DD5746';

/// Export to pdf
document.getElementById('print').addEventListener('click', function() {
    print();
});



/// user manipulations
// update the gui on user movements
function updateEdgePositions()
{
    for(var i = 0; i < edges.length; i++)
    {
        var pos = [edges[i].nodes[0].shape.x()+edges[i].nodes[0].shape.width()+5, edges[i].nodes[0].shape.y()+edges[i].nodes[0].shape.height()/2, edges[i].nodes[1].shape.x()-5, edges[i].nodes[1].shape.y()+edges[i].nodes[1].shape.height()/2];
        edges[i].shape.points(pos);
        var textX, textY;
        if (Math.abs(pos[2] - pos[0]) > Math.abs(pos[3] - pos[1])) {
            // Line is more horizontal
            textX = (pos[0] + pos[2]) / 2;
            textY = (pos[1] + pos[3]) / 2 - 20; // Decal the text a few pixels above
        } else {
            // Line is more vertical
            textX = (pos[0] + pos[2]) / 2 - 35; // Decal the text a few pixels to the left
            textY = (pos[1] + pos[3]) / 2;
        }

        edges[i].display_weight.position({
            x: textX,
            y: textY
        });
        // break;
    }
}

/// change of options
// delete mode
function switchToDeleteMode(deleteMode)
{
    linkMode.value = false;
    deleteMode.value = !(deleteMode.value);
}

// add mode
function chooseOption(event, linkMode)
{
    // just to prevent elements to be destroyed when in adding mode
    deleteMode.value = false;
    linkMode.value = false;
    
    event.stopPropagation(); // to prevent click on the screen making the element disappear
    var menu = document.getElementById('menu');
    var triggerButtonPos = document.getElementById('addButton').getBoundingClientRect();
    // position of the mouse
    var posX = triggerButtonPos.right;
    var posY = triggerButtonPos.top;
    // position of the element
    menu.style.top = posY + 'px';
    menu.style.left = posX + 4 +'px';
    menu.style.display = 'block';
    // Handle option clicks
    document.getElementById('addNode').onclick = function() {
        showAddForm("add_node_prompt");
        menu.style.display = 'none';
    };

    document.getElementById('addEdge').onclick = function() {
        linkMode.value = true;
        menu.style.display = 'none';
    };

    // Prevent stage click event from being triggered
    // event.cancelBubble = true;
}
// function that prints a form which ID is the argument of the function
function showAddForm(name)
{
    deleteMode.value = false;
    linkMode.value = false;
    // console.log("nisy niantso ahooo. ========= "+name);
    var element = document.getElementById(name);
    // console.log(element);
    element.style.display = 'flex';
}
// a function that will prompt a form to get dijkstra input
function getDataInput()
{
    console.log("-----drainnwwwww, lol----");
    showAddForm("dataInput_prompt");
}

/// base gui

// event listeners
document.getElementById('addButton').addEventListener('click', function(event) {
    event.preventDefault();
    chooseOption(event, linkMode);
});

document.getElementById("deleteButton").addEventListener('click', function(event){
    event.preventDefault();
    switchToDeleteMode(deleteMode);
});

document.getElementById("search_path").addEventListener('click', function(event){
    event.preventDefault();
    getDataInput();
});
document.getElementById("inputGot").addEventListener('click', function(event){
    var form = document.getElementById("dataInput_prompt");
    form.style.display="none";
    event.preventDefault();
    // getting the data for the dijkstra algorithm
    var start_point = document.getElementById("starting_node").value;
    var url_target = document.getElementById("target_url").value;
    // console.log(start_point)
    // console.log(url_target)
    dijkstra(start_point, url_target);
});

document.getElementById('nodeAdded').addEventListener('click', function(event){
    event.preventDefault();
    let node_name = document.getElementById('node_name').value;
    if(!node_name)
    {
        event.preventDefault();
    }
    else
    {
        addNode(event);
    }
});
document.getElementById('newURL').addEventListener('click', function(event){
    let url = document.getElementById('url').value;
    if(!url)
    {
        event.preventDefault();
    }
    else
    {
        event.preventDefault();
        addUrl(event, url);
    }
});
var cancels = document.getElementsByClassName('cancel');
for(let i  = 0; i < cancels.length; i++)
{
    cancels[i].addEventListener('click', function(event){
        event.preventDefault();
        selectedServer = null;
        var popups = document.getElementsByClassName('popup');
        for(let j = 0; j < popups.length; j++)
        {
            popups[j].style.display='none';
        }
});
}

document.getElementById('weightAdded').addEventListener('click', function(event){
    event.preventDefault();
    let weight = document.getElementById('weight').value;
    if(!weight)
    {
        event.preventDefault();
    }
    else
    {
        addWeight(event);
    }
});

// socket instaance
document.getElementById('changeState').addEventListener('click', function(event){
    let element = document.getElementById('changeState');
    // changing the state (more code needed for the instanciation)
    selectedServer.state = !selectedServer.state;
    console.log(selectedServer.state);
    if(selectedServer.state === true)
    {
        element.innerHTML = 'Deactivate Server';
        // add the node to the list of nodes
        nodes.push(selectedServer);
    }
    else
    {
        element.innerHTML = 'Activate server';
        // removing the server to the elements of the graph,making it unable to be used for a path search with dijkstra
        let nodeIndex = findNode(selectedServer.name);
        nodes.splice(nodeIndex, 1);
    }
})

// making all elements disappear when the screen is clicked
document.addEventListener('click', function(event) {
    event.preventDefault();
    var element = document.getElementById('menu');
    if (!element.contains(event.target)) {
      // Clicked outside the element, hide it
      element.style.display = 'none';
    }
  });

// creating the stage
var container = document.getElementById('container');
var containerRect = container.getBoundingClientRect();
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: window.innerWidth-100,
    height: window.innerHeight+130,
    });
var stagePos = stage.container().getBoundingClientRect();

// Function to constrain object within stage bounds
function constrainObjectPosition(object) {
    var minX = 0;
    var maxX = stage.width() - object.width()*8.5;
    var minY = 0;
    var maxY = stage.height() - object.height();

    var newX = object.x();
    if(object.x() < minX)
    {
        newX = minX;
    }
    else if(object.x() > maxX)
    {
        newX = maxX;
    }
    var newY = object.y();
    if(object.y() < minY)
    {
        newY = minY;
    }
    else if(object.y() > maxY)
    {
        newY = maxY;
    }

    object.position({ x: newX, y: newY });
    layer.batchDraw();
}

// then a layer
var layer = new Konva.Layer();

stage.add(layer);
// draw the image
layer.draw();