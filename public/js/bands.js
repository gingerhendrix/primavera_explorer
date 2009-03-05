
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
}

function viewCompact(){
  $("#bands").removeClass("full");
  $("#bands").removeClass("list");
  $("#bands").addClass("compact");
}

function viewFull(){
  $("#bands").removeClass("list");
  $("#bands").removeClass("compact");
  $("#bands").addClass("full");
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
  var sortedBands = bandsData.sort(fn);

  var list = $('#bands').clone();
  list.empty();
  sortedBands.forEach(function(b){
    list.append($('#'+b.id))
  });
  $('#bands').replaceWith(list);

}

