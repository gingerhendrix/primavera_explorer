function DaySelector(ui){
  var self = this;
  this.selected = ["thursday", "friday", "saturday"];
  
  this.mouseover =  function(day){
    $(".day.option").removeClass("selectedOver");
    $(".day.option."+day).addClass("selectedOver");
    $('.band').removeClass("selectedOver");
    ui.highlight(bands.selectByDay(day).map(function(b){ return $('#'+b.id); } ));
  }
  
  this.mouseout = function(day){
   $(".stage.day").removeClass("selectedOver");
   ui.clearHighlight();
  }
  
  this.click = function(day){
    alert("Clicked " + day);
  }
  
  
  this.writeControls = function(){
    var container = $('#day_options');
    container.empty();
    [{id : "monday", title : "monday"},
    {id : "tuesday", title : "tuesday"},
    {id : "wednesday", title : "wednesday"},
    {id : "thursday", title : "thursday"},
    {id : "friday", title : "friday"},
    {id : "saturday", title : "saturday"},
    {id : "sunday", title : "sunday"}].forEach(function(day){
      dayEl = document.createElement("span");
      $(dayEl).addClass("option").addClass("day").addClass(day.id);
      $(dayEl).click(function(){ self.click(day.id) });
      $(dayEl).mouseover(function(){ self.mouseover(day.id) });
      $(dayEl).mouseout(function(){ self.mouseout(day.id) });
      $(dayEl).text(day.title);
      container.append(dayEl);
      container.append(' ');
    });
  }

}
