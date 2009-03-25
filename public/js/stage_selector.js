function StageSelector(ui){
  this.ui = ui;
  this.options = [
    {id : "all", title : "all"},
    {id : "estrella", title : "estrella damn"},
    {id : "atp", title : "atp"},
    {id : "pitchfork", title : "pitchfork"},
    {id : "miro", title : "joan miro park"},
    {id : "forum", title : "parc del forum"},
    {id : "apolo", title : "apolo venue"}];
  this.optionClass = "stage";
  this.optionsId = "stage_options"; 
  
}

StageSelector.prototype = new OptionSelector();
