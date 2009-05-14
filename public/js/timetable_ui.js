
var UI = new (function (){
  var start = 300;
  var startTime = 12;//Decimal hours eg. 13.5 == 13:30
  var scale = 100;

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
   // new TimetableScroller();
   var daySelector = new DaySelector();
   daySelector.emitHTML($("div#daySelector"));
    
   timetableData.days.forEach(function(day){
     var startOffset = getDayStart(day); //Time from startTime to first band
     console.log("Day " + day + " " + startOffset);
     day.stages.forEach(function(stage){
       stage.entries.forEach(function(entry, idx){
          var el = $("#"+entry.element_id);
          if(idx==0){
            var filler = document.createElement("li")
            filler.setAttribute("class", "filler");
            var fillerHeight = (getTime(entry) - startOffset) * scale;
            $(filler).css("height", fillerHeight + "px");
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
          var height = (duration*scale) - 10;
          
  //        el.css("position", "absolute");
  //        el.css("left", left + "px");          
          el.css("height", height + "px");          
       });
     });
    });
  }  
  
  function getDayStart(day){
    var start = -1
    day.stages.forEach(function(stage){
      var stageStart = getTime(stage.entries[0]);
      if ( start == -1 || stageStart < start ){
        start = stageStart;
      }
    });
    return start;
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

function DaySelector(){
  var self = this;
  
  function dayToEl(day){
    return $('#'+day.name.replace(/[\W]/g, "_"));
  }

  this.selectDay = function(day){
    var dayEl = dayToEl(day);
    $(".day.selected").removeClass("selected");
    $(dayEl).addClass("selected");
  }

  this.emitHTML = function(container){
    var days =  timetableData.days
    var label  = document.createElement("span")
    label.setAttribute("class", "label");
    $(label).text("Day");
    $(container).append(label);
    days.forEach(function(day){
      var title = day.name
      var option = document.createElement("span")
      option.setAttribute("class", "option");
      $(option).click(function(){ self.selectDay(day); });
      $(option).text(title)
      container.append(option)
      container.append(" ")
    });
    this.createMenu();
  }

  this.createMenu = function(){
    var days =  timetableData.days;
    days.forEach(function(day, i){
      var makeLink = function(day, text, clazz){
        var span = document.createElement("span");
        $(span).addClass("day_link");
        $(span).addClass(clazz);        
        $(span).click(function(){ self.selectDay(day) });
        $(span).text(text);
        return span;
      }
      if(i>0){
        var prevLink = makeLink(days[i-1],"<", "prev");
        $("h2.day", dayToEl(day)).prepend(prevLink);
      }
      if((i+1)<days.length){
        var nextLink = makeLink(days[i+1],">", "next");
        $("h2.day", dayToEl(day)).append(nextLink);
      }      
    });
  }

}
