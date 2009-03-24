function StageSelector(ui){
  var self = this;

  this.mouseover =  function(stage){
    $(".stage.option").removeClass("selectedOver");
    $(".stage.option."+stage).addClass("selectedOver");
    $('.band').removeClass("selectedOver");
    ui.highlight(bands.selectByStage(stage).map(function(b){ return $('#'+b.id); } ));
  }
  
  this.mouseout = function(stage){
   $(".stage.option").removeClass("selectedOver");
   ui.clearHighlight();
  }
  
  this.click = function(stage){
    alert("Clicked " + stage);
  }
  
  
  this.writeControls = function(){
    var container = $('#stage_options');
    container.empty();
    [{id : "estrella", title : "estrella damn"},
    {id : "atp", title : "atp"},
    {id : "pitchfork", title : "pitchfork"},
    {id : "miro", title : "joan miro park"},
    {id : "parc del forum", title : "parc del forum"},
    {id : "apolo", title : "apolo venue"}].forEach(function(stage){
      stageEl = document.createElement("span");
      $(stageEl).addClass("option").addClass("stage").addClass(stage.id);
      $(stageEl).click(function(){ self.click(stage.id) });
      $(stageEl).mouseover(function(){ self.mouseover(stage.id) });
      $(stageEl).mouseout(function(){ self.mouseout(stage.id) });
      $(stageEl).text(stage.title);
      container.append(stageEl);
    });
  }

}
