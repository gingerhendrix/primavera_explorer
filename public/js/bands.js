$(document.body).ready(function(){
  sort(sortByAlpha);
  viewCompact();
});

function jsonProp(json, propRef){
  var props = propRef.split(".");
  var head = props.shift();
  var obj = json[head];
  
  if(obj){
    if(props.length >0){
      var tail = props.join(".");
      return jsonProp(obj, tail);
    }else{
      return obj;
    }
  }
}

function viewList(){
  $("#bands").removeClass("full");
  $("#bands").removeClass("compact");
  $("#bands").addClass("list");
  columnWidth = 600;
  redraw();
}

function viewCompact(){
  $("#bands").removeClass("full");
  $("#bands").removeClass("list");
  $("#bands").addClass("compact");
  columnWidth = 300;
  redraw();  
}

function viewFull(){
  $("#bands").removeClass("list");
  $("#bands").removeClass("compact");
  $("#bands").addClass("full");
  columnWidth = 600;
  redraw();  
}

function redraw(){
  columnFit = Math.floor( $('body').width() / columnWidth );
  if(numColumns!=columnFit){
    numColumns = columnFit;
    columnify();
  }  
}

var expanded;

function expand(el){
  if(expanded && expanded != el) $(expanded).removeClass("expand");
  $(el).toggleClass("expand");
  expanded = el;
}


function sortByPlaycount(b1, b2){
  var pc1 = jsonProp(b1, "lastfm.info.stats.playcount")  || 0;
  var pc2 = jsonProp(b2, "lastfm.info.stats.playcount") || 0;

  return Number(pc1) > Number(pc2) ? -1 : 1;
}

function sortByListeners(b1, b2){
 var l1 = jsonProp(b1, "lastfm.info.stats.listeners") || 0;
 var l2 = jsonProp(b2, "lastfm.info.stats.listeners") || 0;

 return Number(l1) > Number(l2) ? -1 : 1;
}

function sortByAlpha(b1, b2){
 var a1 = jsonProp(b1, "name") || "";
 var a2 = jsonProp(b2, "name") || "";

 return a1 > a2 ? 1 : -1;
}

function sort(fn){
  bandsData = bandsData.sort(fn);
  columnify();
}

var numColumns = 2;

function columnify(){
  var columns = [];
  for(var i=0; i< numColumns; i++){
    var ul = document.createElement("ul");
    $(ul).addClass('column');
    columns.push($(ul));
  }
  var colIdx = 0;
  bandsData.forEach(function(b){
    columns[colIdx].append($('#'+b.id));
    colIdx = (colIdx +1) % numColumns;
  });
  $('#bands').empty();
  columns.forEach(function(c){
    $('#bands').append(c);
  });
}

