var UI = new (function (){
  var expanded;
  var numColumns = 2;
  
  this.sort = function(name){
    $(".sort.option").removeClass("selected");
    $(".sort.option."+name).addClass("selected");
  
    var fn;
    if(name=="alpha"){
      fn = bands.sortByAlpha;
    }else if(name=="listeners"){
      fn = bands.sortByListeners;
    }else if(name=="playcount"){
      fn = bands.sortByPlaycount;
    }
    fn.call(bands);
  
    columnify();
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

  this.viewList = function(){
    changeView("list", 600);
  }

  this.viewCompact = function(){
    changeView("compact", 300);
  }

  this.viewFull = function(){
    changeView("full", 600);
  }
  
  
  function redraw(){
    columnFit = Math.floor( ($('body').width()-190) / columnWidth );
    if(numColumns!=columnFit){
      numColumns = columnFit;
      columnify();
    }  
  }


  function expand(el){
    if(expanded && expanded != el) $(expanded).removeClass("expand");
    $(el).toggleClass("expand");
    expanded = el;
  }

  function columnify(){
    var columns = [];
    for(var i=0; i< numColumns; i++){
      var ul = document.createElement("ul");
      $(ul).addClass('column');
      columns.push($(ul));
    }
    var colIdx = 0;
    bands.data.forEach(function(b){
      columns[colIdx].append($('#'+b.id));
      colIdx = (colIdx +1) % numColumns;
    });
    $('#bands').empty();
    columns.forEach(function(c){
      $('#bands').append(c);
    });
  }
  
  this.writeTagMap = function(){
    var selected;
    bands.tagMap.topTags(42).forEach(function(tag, index, arr){
      var tagEl = document.createElement("a");
      var sizeClass = Math.floor((index/arr.length)*7);
      $(tagEl).attr("href", "#");
      $(tagEl).addClass("tag");
      $(tagEl).addClass("size"+sizeClass);   
      $(tagEl).text(tag);
      $(tagEl).mouseover(function(){
        var selected = bands.tagMap.itemsForTag(tag).map(function(b){ return b.id; });
        selected.forEach(function(id){
          $('#' + id).addClass("selectedOver");
        });
      });
      $(tagEl).mouseout(function(){
        var selected = bands.tagMap.itemsForTag(tag).map(function(b){ return b.id; });
        selected.forEach(function(id){
          $('#' + id).removeClass("selectedOver");
        });
      });
      $(tagEl).click(function(){
        var selected = bands.tagMap.itemsForTag(tag).map(function(b){ return b.id; });
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

})();
