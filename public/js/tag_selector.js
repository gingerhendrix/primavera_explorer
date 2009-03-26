
function TagSelector(ui){
  this.ui = ui;
  var self = this;
  this.selected = [];
  
  this.mouseover =  function(tag, tagEl){
    $("#tagcloud .tag.selectedOver").removeClass("selectedOver");
    $(tagEl).addClass("selectedOver");
    var selected = bands.tagMap.itemsForTag(tag).map(function(b){ return $('#' + b.id); });
    ui.highlight(selected);
  }
  
  this.mouseout = function(tag, tagEl){
    $("#tagcloud .tag.selectedOver").removeClass("selectedOver");
    ui.clearHighlight();
  }

  this.select = function(tag, tagEl){
    $(tagEl).addClass("selected");
    this.selected.push(tag);
    ui.select();
  }
  
  this.deselect = function(tag, tagEl){
    $(tagEl).removeClass("selected");
    var i = this.selected.indexOf(tag);
    if(i>=0){
      this.selected.splice(i, 1);
    }
    ui.select();
 }
  
  this.toggleSelection = function(tag, tagEl){
    var i = this.selected.indexOf(tag);
    if(i>=0){    
      this.deselect(tag, tagEl);
    }else{
      this.select(tag, tagEl);      
    }
    ui.select();
  }
  
  this.click = function(tag, tagEl){
    this.toggleSelection(tag, tagEl);
  }
  
  this.writeControls = function(){
    bands.tagMap.topTags(42).forEach(function(tag, index, arr){
      var tagEl = document.createElement("a");
      var sizeClass = Math.floor((index/arr.length)*7);
      $(tagEl).attr("href", "#");
      $(tagEl).addClass("tag");
      $(tagEl).addClass("size"+sizeClass);   
      $(tagEl).text(tag);
      $(tagEl).mouseover(function(){ self.mouseover(tag, tagEl) });
      $(tagEl).mouseout(function(){ self.mouseout(tag, tagEl) });
      $(tagEl).click(function(){ self.click(tag, tagEl) });
      $('#tagcloud').append(tagEl);
      $('#tagcloud').append(' ');
   });
  }
}
