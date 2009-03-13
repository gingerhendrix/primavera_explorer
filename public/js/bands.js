var tagMap;

$(document.body).ready(function(){
  viewCompact();
  sort('listeners');
  window.setTimeout(function(){
    tagMap = makeTagMap();
    writeTagMap();
  }, 10);
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

function changeView(name, width){
  $("#bands").removeClass("full");
  $("#bands").removeClass("compact");
  $("#bands").removeClass("list");
  
  $("#bands").addClass(name);
  
  $(".view.option").removeClass("selected");
  $(".view.option."+name).addClass("selected");

  columnWidth = width;  
  redraw();
}

function viewList(){
  changeView("list", 600);
}

function viewCompact(){
  changeView("compact", 300);
}

function viewFull(){
  changeView("full", 600);
}

function redraw(){
  columnFit = Math.floor( ($('body').width()-190) / columnWidth );
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

function sort(name){
  $(".sort.option").removeClass("selected");
  $(".sort.option."+name).addClass("selected");
  
  var fn;
  if(name=="alpha"){
    fn = sortByAlpha;
  }else if(name=="listeners"){
    fn = sortByListeners;
  }else if(name=="playcount"){
    fn = sortByPlaycount;
  }
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


function makeTagMap(){
  var tagMap = new Folksonomy();
  bandsData.forEach(function(band){
    var tags = jsonProp(band, "lastfm.tags.tag") || [];
    if($.isArray(tags)){
      var tagCloud = new TagCloud();
      tags.forEach(function(t){
        tagCloud.addTag(t.name, t.count);
      });
      tagCloud.normalizeNames();
      tagCloud.removeZeroWeighted();
      tagMap.add(band, tagCloud);
    }
  });
  return tagMap;
}

function writeTagMap(){
 var selected;
 tagMap.topTags(42).forEach(function(tag, index, arr){
   var tagEl = document.createElement("a");
   var sizeClass = Math.floor((index/arr.length)*7);
   $(tagEl).attr("href", "#");
   $(tagEl).addClass("tag");
   $(tagEl).addClass("size"+sizeClass);   
   $(tagEl).text(tag);
   $(tagEl).mouseover(function(){
      var selected = tagMap.itemsForTag(tag).map(function(b){ return b.id; });
      selected.forEach(function(id){
        $('#' + id).addClass("selectedOver");
      });
   });
   $(tagEl).mouseout(function(){
      var selected = tagMap.itemsForTag(tag).map(function(b){ return b.id; });
      selected.forEach(function(id){
        $('#' + id).removeClass("selectedOver");
      });
   });
   $(tagEl).click(function(){
    var selected = tagMap.itemsForTag(tag).map(function(b){ return b.id; });
    var select = !($(tagEl).hasClass("selected"));
    $("#bands .band.selected").removeClass("selected");
    $("#tagcloud .tag.selected").removeClass("selected");
    if(select){
      $(tagEl).addClass("selected");
      selected.forEach(function(id){
          $('#' + id).addClass("selected");
      });
    }
    
   });
   $('#tagcloud').append(tagEl);
   $('#tagcloud').append(' ');
 });
}

function selectTag(tag){

}
