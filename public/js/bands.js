var tracker;

$(document.body).ready(function(){
  tracker = new Tracker(pageTracker);
  bands = new Bands(bandsData);
  UI.viewCompact();
  UI.sort('listeners');
  window.setTimeout(function(){
    bands.makeTagMap();
    UI.writeControls();
    UI.select();
  }, 10);
});


function jsonProp(json, propRef){
  var props = propRef.split(".");
  var head = props.shift();
  var obj = json[head];
  
  if(obj){
    if(props.length >0){
      var tail = props.join(".");
      return jsonProp(obj, tail);
    }else{
      return obj;
    }
  }
}

var bands;

function Bands(bandsData){
  this.data = bandsData;
  this.tagMap;
  var self = this;

  this.sortByPlaycount = function(){
    this.data = this.data.sort(function(b1, b2){
      var pc1 = jsonProp(b1, "info.stats.playcount")  || 0;
      var pc2 = jsonProp(b2, "info.stats.playcount") || 0;
      return Number(pc1) > Number(pc2) ? -1 : 1;
    });
  }
  
  this.sortByListeners = function(){
    this.data = this.data.sort(function(b1, b2){
     var l1 = jsonProp(b1, "info.stats.listeners") || 0;
     var l2 = jsonProp(b2, "info.stats.listeners") || 0;
     return Number(l1) > Number(l2) ? -1 : 1;
    });
  }

  this.sortByAlpha = function(){
    this.data = this.data.sort(function(b1, b2){
       var a1 = jsonProp(b1, "name");
       var a2 = jsonProp(b2, "name");
       return a1 > a2 ? 1 : -1;
    });
  }
  
  this.sortByDate = function(){
     this.data = this.data.sort(function(b1, b2){
       var d1 = new Date(jsonProp(b1, "timetable.date"));
       var d2 = new Date(jsonProp(b2, "timetable.date"));
       return d1 > d2 ? 1 : -1;
    });
  }
  
  
  this.makeTagMap = function(){
    var self = this;
    this.tagMap = new Folksonomy();
    bandsData.forEach(function(band){
      var tags = jsonProp(band, "tags.tag") || [];
      if($.isArray(tags)){
        var tagCloud = new TagCloud();
        tags.forEach(function(t){
          tagCloud.addTag(t.name, t.count);
        });
       // tagCloud.normalizeNames();
       // tagCloud.removeZeroWeighted();
        self.tagMap.add(band, tagCloud);
      }
    });
    return this.tagMap;
  }
  
  function isOnDay(b, day){
    var band_day = jsonProp(b, "timetable.day");
     if(band_day){
       return (band_day.toLowerCase().indexOf(day) >= 0)
     }else{
      return false;
     }
  }

  function isOnStage(band, stage){
    var band_stage = jsonProp(band, "timetable.stage");
    if(band_stage){
      return (band_stage.toLowerCase().indexOf(stage) >= 0)
    }else{
      return false;
    }
  }
  
  function hasTag(band, tag){
    return self.tagMap.tagsForItem(band).some(function(t){ return (t.tag == tag) && (t.weight > 10); });
  }

  this.selectByDay = function(day){
    return this.data.filter(function(b){return isOnDay(b, day)});
  }

  this.selectByStage = function(stage){
    return this.data.filter(function(b){return isOnStage(b, stage)});
  }
  
  this.select = function(selector){
    return this.data.filter(function(b){
      var selected = true;
      selected = selected && (selector.days.length==0 || selector.days.some(function(day){ return isOnDay(b, day) }));
      selected = selected && (selector.stages.length==0 || selector.stages.some(function(stage){ return isOnStage(b, stage) }));
      selected = selected && (selector.tags.length==0 || selector.tags.some(function(tag){ return hasTag(b, tag) }));   
      return selected;     
    });
  
  }
  
  this.find_by_id = function(band_id){
    console.log("Finding " + band_id);
    return this.data.filter(function(b){
      return b.id === band_id;
    })[0];
  }

}

