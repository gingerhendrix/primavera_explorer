

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


function TagSelector(ui){
  this.ui = ui;
  var self = this;
  this.selected = [];
  
  this.mouseover =  function(tag, tagEl){
    $("#tagcloud .tag.selectedOver").removeClass("selectedOver");
    $(tagEl).addClass("selectedOver");
    var selected = bands.tagMap.tuplesForTag(tag).tuples.map(function(t){ return bands.tagMap.tuple(t); });
    ui.fuzzyHighlight(selected);
  }
  
  this.mouseout = function(tag, tagEl){
    $("#tagcloud .tag.selectedOver").removeClass("selectedOver");
    ui.clearHighlight();
  }

  this.select = function(tag, tagEl){
    this.selected = [];
    $(tagEl).addClass("selected");
    this.selected.push(tag);
    ui.select();
  }
  
  this.deselect = function(tag, tagEl){
    $(tagEl).removeClass("selected");
    var i = this.selected.indexOf(tag);
    if(i>=0){
      this.selected.splice(i, 1);
    }
    ui.select();
 }
  
  this.clearSelection = function(){
    $("#tagcloud .tag.selected").removeClass("selected");  
  }
  
  this.toggleSelection = function(tag, tagEl){
    var i = this.selected.indexOf(tag);
    if(i>=0){    
      this.deselect(tag, tagEl);
    }else{
      this.select(tag, tagEl);      
    }
    ui.select();
  }
  
  this.click = function(tag, tagEl){
    this.clearSelection()
    this.toggleSelection(tag, tagEl);
  }
  
  this.writeControls = function(){
    bands.tagMap.topTags(42).forEach(function(tag, index, arr){
      var tagEl = document.createElement("a");
      var sizeClass = Math.floor((index/arr.length)*7);
      $(tagEl).attr("href", "#");
      $(tagEl).addClass("tag");
      $(tagEl).addClass("size"+sizeClass);   
      $(tagEl).text(tag);
      $(tagEl).mouseover(function(){ self.mouseover(tag, tagEl) });
      $(tagEl).mouseout(function(){ self.mouseout(tag, tagEl) });
      $(tagEl).click(function(){ self.click(tag, tagEl) });
      $('#tagcloud').append(tagEl);
      $('#tagcloud').append(' ');
   });
  }
}

var UI = new (function (){
  var expanded;
  var numColumns = 2;
  var self = this;
  var selected = [];
  
  this.stageSelector = new StageSelector(this);
  this.daySelector = new DaySelector(this);
  this.tagSelector = new TagSelector(this);
  
  this.sort = function(name){
    $(".sort.option").removeClass("selected");
    $(".sort.option."+name).addClass("selected");
  
    var fn;
    if(name=="alpha"){
      fn = bands.sortByAlpha;
    }else if(name=="listeners"){
      fn = bands.sortByListeners;
    }else if(name=="playcount"){
      fn = bands.sortByPlaycount;
    }
    fn.call(bands);
  
    columnify();
  }
  
  this.writeControls = function(){
    this.tagSelector.writeControls();
    this.stageSelector.writeControls();
    this.daySelector.writeControls();
  }
  
  
  function changeView(name, width){
    $("#bands").removeClass("full");
    $("#bands").removeClass("compact");
    $("#bands").removeClass("list");
  
    $("#bands").addClass(name);
  
    $(".view.option").removeClass("selected");
    $(".view.option."+name).addClass("selected");

    columnWidth = width;  
    redraw();
  }

  this.viewList = function(){
    changeView("list", 600);
  }

  this.viewCompact = function(){
    changeView("compact", 300);
  }

  this.viewFull = function(){
    changeView("full", 600);
  }
  
  
  function redraw(){
    columnFit = Math.floor( ($('body').width()-190) / columnWidth );
    if(numColumns!=columnFit){
      numColumns = columnFit;
      columnify();
    }  
  }


  this.expand = function(el){
    tracker.trackArtistSelect($(el).attr("id"));
    if(expanded && expanded != el) $(expanded).removeClass("expand");
    $(el).toggleClass("expand");
    expanded = el;
  }

  this.clearHighlight = function(){
  //  $('.band').removeClass("selectedOver");
    $('.band').css('opacity', 1);
  }
  
  this.highlight = function(){
    var highlighted;
    if(this.daySelector.highlighted){
      highlighted = bands.selectByDay(this.daySelector.highlighted);
    }else if(this.stageSelector.highlighted){
      highlighted = bands.selectByStage(this.stageSelector.highlighted);
    }else{
      highlighted = [];
    }
    $('.band').css('opacity', 0);
    highlighted.forEach(function(band){
//       bandToElement(band).addClass("selectedOver");
       bandToElement(band).css('opacity', 1);
    });
  }
  
  this.fuzzyHighlight = function(selection){
    $('.band').css('opacity', 0);
    selection.forEach(function(tuple){
      bandToElement(tuple.item).css('opacity', tuple.weight/100);
    });
  }
  
  this.currentSelector = function(){
    return {
     days : this.daySelector.selected,
     stages : this.stageSelector.selected,
     tags : this.tagSelector.selected
     };
  };
  
  function bandToElement(b){
     return $('#'+b.id)
  }
  
  function elementToBand(el){
    return bands.find_by_id($(el).attr("id"))
  }
  
  this.select = function(){
    selected = bands.select(this.currentSelector());
    bands.data.forEach(function(band){
      band.selected = false;
    });
    selected.forEach(function(band){
      band.selected = true;
    });
    columnify();
  }

  function columnify(){
    var columns = [];
    var hidden = $(document.createElement("ul"));
    
    for(var i=0; i< numColumns; i++){
      var ul = document.createElement("ul");
      $(ul).addClass('column');
      columns.push($(ul));
    }
    var colIdx = 0;
    bands.data.forEach(function(b){
      if(b.selected){
        columns[colIdx].append($('#'+b.id));
        colIdx = (colIdx +1) % numColumns;
      }else{
        hidden.append($('#'+b.id));
      }
    });
    $('#bands').empty();
    columns.forEach(function(c){
      $('#bands').append(c);
    });
     $('#hidden_bands').empty();
     $('#hidden_bands').append(hidden);
  }
  

})();

/**
 * A TagMap
 * @classDescription  A TagMap
 * 
 */
function TagMap(){
  
  //Firefox only (toSource is a non-ecma extension)
	
  //All the items
  var items = [];
  //A map connecting items to their index in items
  var tagMap = {};
  
  //All the tags
  var tags = [];

  //A map connecting item idxs to their tags (needed by intersection)
  //Using an array since we indexes are integers
  var itemMap = [];

  this.allItems = function(){
    return items;
  }
  
  this.tagNames = function(){
    return tags;
  }
  
  this.itemsForTag = function(tag){
    return tagMap[tag].map(function(idx){
       return items[idx];
    });
  } 
  
  this.intersection = function(tag){
    var intersection = new TagMap();
    tagMap[tag].forEach(function(idx){
      var itemTags = itemMap[idx];
      itemTags = itemTags.filter(function(t){
        return t!=tag;
      });
      intersection.add(items[idx], itemTags);
    });
    return intersection;
  }
  
  this.difference = function(tag){
    var difference = new TagMap();
    itemMap.forEach(function(ts, i){
      if(! ts.some(function(t){ return (t == tag) }) ){
        difference.add(items[i], ts);
      }
    });
    return difference;
  }
   
  this.removeTag = function(tag){
    tags = tags.filter(function(t){return t != tag;});
    if(tagMap[tag]){
      tagMap[tag].forEach(function(idx){
         itemMap[idx] = itemMap[idx].filter(function(t){ return t != tag; });
      });
      delete tagMap[tag];
    }
  }
  
	/**
	 * Add an item and its tags
	 * @param item a tagged resource (any object)
	 * @param ts an array of tags
	 */
	this.add = function(item, ts){
		items.push(item);
    var idx = items.length -1;
    itemMap[idx] = ts;
    for(var i=0; i<ts.length; i++){
		  var tag = ts[i];
		  tag = tag
      if(!tagMap[tag] ){
	    			tagMap[tag] = [];
    				tags.push(tag);
			 }
			 tagMap[tag].push(idx);
     }
     tags = sort(tags);
	 };
	
	/**
	  * Returns tags that have at least n items in the tagmap
	  *
	  */
	this.popularTags = function(n){
    var ts = tags.filter(function(tag){
      return (tagMap[tag].length >= n);
    });

    ts = sort(ts);
    
    return ts;
  }
  
  function sort(tags){
    return tags.sort(function(t1, t2){ 
      return ( (tagMap[t1].length > tagMap[t2].length) ? -1 : 1);
    });
  }
  
  this.clone = function(){
    var clone = new TagMap();
    items.forEach(function(item, idx){
      clone.add(item, itemMap[idx]);
    });
    return clone;
  }
  
  this.topTag = function(){
    if(tags.length > 0){
      return tags[0];
    }
  }
  

		
	this.minimumSpanningSet = function(){
    var tm = this.clone();
    var mss = [];
    var tag;
    while(tag = tm.topTag()){
      mss.push(tag);
      tm = tm.difference(tag);
    }
    return mss;
	}
}

/**
  * A weighted list of tags.
  *
  */
function TagCloud(){
  var tags = [];
  var tagWeights = {};
  
  this.addTag = function(tag, weight){
    tags.push(tag);
    tagWeights[tag] = Number(weight);
  }

  this.sort = function(){
   tags = tags.sort(function(t1, t2){
      return (tagWeights[t1] > tagWeights[t2]) ? -1 : 1;
    });
  }
  
  this.eachTag = function(fn){
    tags.forEach(function(t){
      fn(t, tagWeights[t]);
    });
  }

  function normalizeName(n){
    return n.toLowerCase().replace(/\W/g,  "");
  }
  
  this.normalizeNames = function(){
    this.sort(); //Ensure most popular variation wins
    for(var i=0; i<tags.length; i++){
      var tag = tags[i];
      for(var j=i+1; j<tags.length; j++){
        var comparison = tags[j];
        if(normalizeName(tag) == normalizeName(comparison)){
          tagWeights[tag] +=  tagWeights[comparison];
          tagWeights[comparison] = 0;
        }        
      };
    }
    this.removeZeroWeighted();
  }
  
  this.removeZeroWeighted = function(){
   tags = tags.filter(function(t){ return tagWeights[t] > 0 });
  }
  
  this.topTags = function(count){
   this.sort();
   return tags.slice(0, count);
  }

}

/**
  * Represents a weighted hash for storing items + tags + weights.
  * Effectively a fuzzy set.
  *
  */
function Folksonomy(){
  
  var tuples = [];
  var tagIndex = {};// { tag : { tuples : [tupleIndex], cumulativeWeight : weight} }
  var itemIndex = {};
  var tags = []; // All the tags
  
  this.add = function(item, tagCloud){
    itemIndex[item.id] = [];
    tagCloud.eachTag(function(tag, weight){
      var tuple = {item : item, tag: tag, weight : Number(weight)};
      tuples.push(tuple);
      var tupleId = tuples.length -1;
      itemIndex[item.id].push({tag : tag, weight : weight});
      if(!tagIndex[tag]){
        tags.push(tag);
        tagIndex[tag] = { tuples : [], cumulativeWeight : 0 };
      }
      tagIndex[tag].tuples.push(tupleId);
      tagIndex[tag].cumulativeWeight += Number(weight);
    });
  }
  
  this.compareTagWeights = function(t1, t2){
     return (tagIndex[t1].cumulativeWeight < tagIndex[t2].cumulativeWeight ) ? 1 : -1;
  }
  
  this.topTags = function(n){
    tags = tags.sort(this.compareTagWeights);
    return tags.slice(0, n);
  }
  
  this.tuple = function(idx){
    return tuples[idx];
  }
  
  this.tuplesForTag = function(tag){
    return tagIndex[tag];
  }
  
  this.tagsForItem = function(item){
    return itemIndex[item.id] || [];  
  }
  
  this.itemsForTag = function(tag, cutoff){
     if(!cutoff) cutoff = 10;
     return tagIndex[tag].tuples.filter(function(tupleId){
        return tuples[tupleId].weight > cutoff;
     }).map(function(tupleId){
       return tuples[tupleId].item;
     });
  }

}

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
       var a1 = jsonProp(b1, "name") || "";
       var a2 = jsonProp(b2, "name") || "";
       return a1 > a2 ? 1 : -1;
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



function Tracker(pageTracker){
  
  this.trackArtistSelect = function(artist_name){
    pageTracker._trackEvent("Artists", "Select", artist_name);
  }
}

