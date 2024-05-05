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

console.log(nodes);
// when in link mode, these will contain the selected nodes
var selectedNode1 = null;
var selectedNode2 = null;
