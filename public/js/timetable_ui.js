
var UI = new (function (){
  var expanded;
  
/*  this.expand = function(el){
  //  tracker.trackArtistSelect($(el).attr("id"));
    if(expanded && expanded != el) $(expanded).removeClass("expand");
    $(el).toggleClass("expand");
    expanded = el;
  }
*/
  
  this.init = function(){
    timetableData.days.forEach(function(day){
     day.stages.forEach(function(stage){
       var start = 300;
       var startTime = 12;
       var scale = 300;
       stage.entries.forEach(function(entry){
          var el = $("#"+entry.element_id);

          var time = entry.time;
          var match = time.match(/([\d]{2}):([\d]{2})/);
          if(!match){
            el.css("display", "none");
            return;
          }
          var hours = Number(match[1])
          var mins = Number(match[2])
          if(hours < 8){
            hours += 24;
          }
          var left = start + ((hours -startTime)*scale) + (mins *(scale/60));

          el.css("position", "absolute");
          el.css("left", left + "px");          
          
       });
     });
    });
  }  

})();
