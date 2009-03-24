
$(document.body).ready(function(){
  bands = new Bands(bandsData);
  UI.viewCompact();
  UI.sort('listeners');
  window.setTimeout(function(){
    bands.makeTagMap();
    UI.writeControls();
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

  this.sortByPlaycount = function(){
    this.data = this.data.sort(function(b1, b2){
      var pc1 = jsonProp(b1, "lastfm.info.stats.playcount")  || 0;
      var pc2 = jsonProp(b2, "lastfm.info.stats.playcount") || 0;
      return Number(pc1) > Number(pc2) ? -1 : 1;
    });
  }
  
  this.sortByListeners = function(){
    this.data = this.data.sort(function(b1, b2){
     var l1 = jsonProp(b1, "lastfm.info.stats.listeners") || 0;
     var l2 = jsonProp(b2, "lastfm.info.stats.listeners") || 0;
     return Number(l1) > Number(l2) ? -1 : 1;
    });
  }

  this.sortByAlpha = function(){
    this.data = this.data.sort(function(b1, b2){
       var a1 = jsonProp(b1, "name") || "";
       var a2 = jsonProp(b2, "name") || "";
       return a1 > a2 ? 1 : -1;
    });
  }
  
  
  this.makeTagMap = function(){
    var self = this;
    this.tagMap = new Folksonomy();
    bandsData.forEach(function(band){
      var tags = jsonProp(band, "lastfm.tags.tag") || [];
      if($.isArray(tags)){
        var tagCloud = new TagCloud();
        tags.forEach(function(t){
          tagCloud.addTag(t.name, t.count);
        });
        tagCloud.normalizeNames();
        tagCloud.removeZeroWeighted();
        self.tagMap.add(band, tagCloud);
      }
    });
    return this.tagMap;
  }
  
  this.selectByDay = function(day){
    return this.data.filter(function(b){
       var band_day = jsonProp(b, "timetable.day");
       if(band_day){
         return (band_day.toLowerCase().indexOf(day) >= 0)
       }else{
        return false;
       }
    });
  }

  this.selectByStage = function(stage){
    return this.data.filter(function(b){
      var band_stage = jsonProp(b, "timetable.stage");
       if(band_stage){
         return (band_stage.toLowerCase().indexOf(stage) >= 0)
       }else{
        return false;
       }
    });
  }

}

