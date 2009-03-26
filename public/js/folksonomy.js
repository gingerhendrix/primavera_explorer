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
