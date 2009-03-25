function DaySelector(ui){
  this.ui = ui;
  this.optionClass = "day";
  this.optionsId = "day_options"; 
  this.options =    
   [{id : "all", title : "all"},
    {id : "monday", title : "monday"},
    {id : "tuesday", title : "tuesday"},
    {id : "wednesday", title : "wednesday"},
    {id : "thursday", title : "thursday"},
    {id : "friday", title : "friday"},
    {id : "saturday", title : "saturday"},
    {id : "sunday", title : "sunday"}];
}

DaySelector.prototype = new OptionSelector();
