
function OptionSelector(){
  this.ui; //Override in child class
  this.options = []; //Override in child class
  this.optionClass = ""; //Override in child class
  this.optionsId = ""; //Override in child class

  this.selected = [];
  this.highlighted;

  this.mouseover =  function(option){
    $(".option."+this.optionClass).removeClass("selectedOver");
    this.getOptionElement(option).addClass("selectedOver");
    this.highlighted = option;
    //this.ui.highlight();
  }
  
  this.mouseout = function(option){
   $(".option." + this.optionClass).removeClass("selectedOver");
   this.highlighted = false;
   //this.ui.clearHighlight();
  }
  
  this.getOptionElement = function(option){
    return $('.option.'+this.optionClass + "."+option);
  }
  
  this.select = function(option){
    this.getOptionElement(option).addClass("selected");
    if(option != "all"){
      this.selected.push(option);
    }
  }
  
  this.deselect = function(option){
    this.getOptionElement(option).removeClass("selected");
    var i = this.selected.indexOf(option);
    if(i>=0){
      this.selected.splice(i, 1);
    }
  }
  
  this.clearSelection = function(option){
    this.selected = [];
    $(".option."+this.optionClass).removeClass("selected");  
  }
  
  this.toggleSelection = function(option){
    var i = this.selected.indexOf(option);
    if(i>=0){    
      this.deselect(option);
    }else{
      this.select(option);      
    }

  }
  
  this.click = function(option, optionEl){
    this.clearSelection();
    this.select(option);
    // this.toggleSelection(option);
    this.ui.select();
  }
  
  
  this.writeControls = function(){
    var container = $("#" + this.optionsId);
    container.empty();
    var self = this;
    this.options.forEach(function(option){
      optionEl = document.createElement("span");
      $(optionEl).addClass("option").addClass(self.optionClass).addClass(option.id);
      $(optionEl).click(function(){ self.click(option.id, self) });
      $(optionEl).mouseover(function(){ self.mouseover(option.id, self) });
      $(optionEl).mouseout(function(){ self.mouseout(option.id, self) });
      $(optionEl).text(option.title);
      container.append(optionEl);
      container.append(' ');
    });
    this.select("all");
  } 

}
