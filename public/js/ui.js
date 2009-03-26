var UI = new (function (){
  var expanded;
  var numColumns = 2;
  var self = this;
  var selected = [];
  
  this.stageSelector = new StageSelector(this);
  this.daySelector = new DaySelector(this);
  this.tagSelector = new TagSelector(this);
  
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
  
  this.writeControls = function(){
    this.tagSelector.writeControls();
    this.stageSelector.writeControls();
    this.daySelector.writeControls();
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


  this.expand = function(el){
    if(expanded && expanded != el) $(expanded).removeClass("expand");
    $(el).toggleClass("expand");
    expanded = el;
  }

  this.clearHighlight = function(){
  //  $('.band').removeClass("selectedOver");
    $('.band').css('opacity', 1);
  }
  
  this.highlight = function(){
    var highlighted;
    if(this.daySelector.highlighted){
      highlighted = bands.selectByDay(this.daySelector.highlighted);
    }else if(this.stageSelector.highlighted){
      highlighted = bands.selectByStage(this.stageSelector.highlighted);
    }else{
      highlighted = [];
    }
    $('.band').css('opacity', 0);
    highlighted.forEach(function(band){
//       bandToElement(band).addClass("selectedOver");
       bandToElement(band).css('opacity', 1);
    });
  }
  
  this.fuzzyHighlight = function(selection){
    $('.band').css('opacity', 0);
    selection.forEach(function(tuple){
      bandToElement(tuple.item).css('opacity', tuple.weight/100);
    });
  }
  
  this.currentSelector = function(){
    return {
     days : this.daySelector.selected,
     stages : this.stageSelector.selected,
     tags : this.tagSelector.selected
     };
  };
  
  function bandToElement(b){
     return $('#'+b.id)
  }
  
  this.select = function(){
    selected = bands.select(this.currentSelector());
    bands.data.forEach(function(band){
      band.selected = false;
    });
    selected.forEach(function(band){
      band.selected = true;
    });
    columnify();
  }

  function columnify(){
    var columns = [];
    var hidden = $(document.createElement("ul"));
    
    for(var i=0; i< numColumns; i++){
      var ul = document.createElement("ul");
      $(ul).addClass('column');
      columns.push($(ul));
    }
    var colIdx = 0;
    bands.data.forEach(function(b){
      if(b.selected){
        columns[colIdx].append($('#'+b.id));
        colIdx = (colIdx +1) % numColumns;
      }else{
        hidden.append($('#'+b.id));
      }
    });
    $('#bands').empty();
    columns.forEach(function(c){
      $('#bands').append(c);
    });
     $('#hidden_bands').empty();
     $('#hidden_bands').append(hidden);
  }
  

})();
