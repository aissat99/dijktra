/// user manipulations
// update the gui on user movements
function updateEdgePositions()
{
    for(var i = 0; i < edges.length; i++)
    {
        var pos = [edges[i].nodes[0].shape.x(), edges[i].nodes[0].shape.y(), edges[i].nodes[1].shape.x(), edges[i].nodes[1].shape.y()];
        edges[i].shape.points(pos);
        var textX, textY;
        if (Math.abs(pos[2] - pos[0]) > Math.abs(pos[3] - pos[1])) {
            // Line is more horizontal
            textX = (pos[0] + pos[2]) / 2;
            textY = (pos[1] + pos[3]) / 2 - 40; // Decal the text a few pixels above
        } else {
            // Line is more vertical
            textX = (pos[0] + pos[2]) / 2 - 60; // Decal the text a few pixels to the left
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
    console.log("delete mode: "+deleteMode.value);
}

// add mode
function chooseOption(event, linkMode)
{
    // just to prevent elements to be destroyed when in adding mode
    deleteMode.value = false;
    linkMode.value = false;

    var menu = document.getElementById('menu');
    var triggerButtonPos = document.getElementById('addButton').getBoundingClientRect();
    // position of the mouse
    var posX = triggerButtonPos.right;
    var posY = triggerButtonPos.top;
    // position of the element
    menu.style.top = posY + 'px';
    menu.style.left = posX + 3 + 'px';
    menu.style.display = 'block';
    // Handle option clicks
    document.getElementById('addNode').onclick = function() {
        showAddForm("add_node_form");
        menu.style.display = 'none';
    };

    document.getElementById('addEdge').onclick = function() {
        linkMode.value = true;
        menu.style.display = 'none';
    };

    // Prevent stage click event from being triggered
    // event.cancelBubble = true;
}
function showAddForm(name)
{
    deleteMode.value = false;
    linkMode.value = false;
    // console.log("nisy niantso ahooo. ========= "+name);
    var element = document.getElementById(name);
    // console.log(element);
    element.style.display = 'block';
    // console.log(element.style.display);
    return element.value;
}

/// base gui

// event listeners
document.getElementById('addButton').addEventListener('click', function(event) {
    // event.preventDefault();
    chooseOption(event, linkMode);
});

document.getElementById("deleteButton").addEventListener('click', function(){
    switchToDeleteMode(deleteMode);
});

document.getElementById('nodeAdded').addEventListener('click', function(event){
    addNode(event);
});

document.getElementById('weightAdded').addEventListener('click', function(event){
    addWeight(event);
});

// creating the stage
var container = document.getElementById('container');
var containerRect = container.getBoundingClientRect();
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: window.innerWidth-100,
    height: window.innerHeight+130,
    });
console.log(stage.getAbsolutePosition().x);
console.log(stage.width());
var stagePos = stage.container().getBoundingClientRect();
console.log(stagePos);

// Function to constrain object within stage bounds
function constrainObjectPosition(object) {
    // stagePos = stage.getAbsolutePosition();
    // stage_x = stagePos.x;
    // stage_y = stagePos.y;
    // // Constrain object horizontally
    // if (object.x() < stage_x) {
    //   object.x(stage_x);
    // } else if (object.x() > container.offsetWidth - object.radius()) {
    //   object.x(container.offsetWidth - object.radius());
    // }
  
    // // Constrain object vertically
    // if (object.y() < 0) {
    //   object.y(0);
    // } else if (object.y() > container.offsetHeight - object.radius()) {
    //   object.y(container.offsetHeight - object.radius());
    // }
    var containerRect = stage.container().getBoundingClientRect();
    console.log(containerRect)

    var minX = -30;
    var maxX = /*stagePos.x + */stage.width() - object.radius() * 12;
    var minY = 0;
    var maxY = /*stagePos.y + */stage.height() - object.radius() * 3.5;

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
        console.log("mihoatra");
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