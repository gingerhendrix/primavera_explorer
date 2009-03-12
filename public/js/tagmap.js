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
