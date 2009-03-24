
function TagSelector(ui){
  this.ui = ui;
  var self = this;
  
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
  
  this.click = function(tag, tagEl){
    var selected = bands.tagMap.itemsForTag(tag).map(function(b){ return $('#' + b.id); });
    var select = !($(tagEl).hasClass("selected"));
    $("#tagcloud .tag.selected").removeClass("selected");
    $("#bands .band.selected").removeClass("selected");
    if(select){
      $(tagEl).addClass("selected");
        selected.forEach(function(el){
          el.addClass("selected");
       });
    }
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
