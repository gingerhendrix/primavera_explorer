
var UI = new (function (){
  var start = 300;
  var startTime = 12;//Decimal hours eg. 13.5 == 13:30
  var scale = 300;

  var expanded;
  
  this.expand = function(){
    var el = this;
  //  tracker.trackArtistSelect($(el).attr("id"));
    if(expanded && expanded != el) $(expanded).removeClass("expand");
    $(el).toggleClass("expand");
    expanded = el;
  }
  
  this.init = function(){
    var self = this;
    new TimetableScroller();
    
    timetableData.days.forEach(function(day){
     day.stages.forEach(function(stage){
       stage.entries.forEach(function(entry, idx){
          var el = $("#"+entry.element_id);
          if(idx==0){
            var filler = document.createElement("li")
            filler.setAttribute("class", "filler");
            var fillerWidth = getTime(entry) * scale;
            $(filler).css("width", fillerWidth + "px");
            el.before(filler);                       
          }

          el.click(self.expand);
          
        /*  var time = getTime(entry);
          if(time < 0){
            console.log("WARNING: no time for %o", entry);
            el.css("display", "none");
            return;
          }
          var left = start + (time*scale);
         */ 
          if((idx+1) < stage.entries.length){
            var duration = getDuration(entry, stage.entries[idx+1]);
          }else{
            duration = 1;
          }
          var width = (duration*scale) - 10;
          
  //        el.css("position", "absolute");
  //        el.css("left", left + "px");          
          el.css("width", width + "px");          
       });
     });
    });
  }  
  
  function getTime(entry){
    var time = entry.time;
    var match = time.match(/([\d]{2}):([\d]{2})/);
    if(!match){
      return -1;
    }
    var hours = Number(match[1])
    var mins = Number(match[2])
    if(hours < 8){
      hours += 24;
    }
    return (hours + (mins/60)) - startTime;  
  }
  
  function getDuration(entry1, entry2){
    return getTime(entry2) - getTime(entry1);
  }

})();

function TimetableScroller(){

  this.init = function(){
    console.log("New TimetableScroller");
    $(window).scroll(function(e){
       
        $("#labels").css('margin-top', "-" + $(document).scrollTop() + "px");
        
        $("#timetable").css('margin-top', "-" + $(document).scrollTop() + "px"); 
        $("#timetable").css('margin-left', "-" + $(document).scrollLeft() + "px");
    });
  }
  this.init();
}
