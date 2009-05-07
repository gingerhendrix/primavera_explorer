function StageSelector(ui){
  this.ui = ui;
  this.options = [
    {id : "all", title : "all"},
    {id : "estrella", title : "estrella damn"},
    {id : "atp", title : "atp"},
    {id : "pitchfork", title : "pitchfork"},
    {id : "miro", title : "joan miro park"},
    {id : "auditori", title : "auditori"},
    {id : "apolo", title : "apolo venue"},
    {id : "vice", title : "vice"},
    {id : "rockdelux", title: "rockdelux"}];
  this.optionClass = "stage";
  this.optionsId = "stage_options"; 
  
}

StageSelector.prototype = new OptionSelector();
