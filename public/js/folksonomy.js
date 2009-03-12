/**
  * Represents a weighted hash for storing items + tags + weights.
  * Effectively a fuzzy set.
  *
  */
function Folksonomy(){
  
  var tagIndex = {};// { tag : { tuples : [tupleIndex], cumulativeWeight : weight} }
  var tags = []; // All the tags
  
  this.add = function(item, tagCloud){
    tagCloud.eachTag(function(tag, weight){
      var tuple = {item : item, tag: tag, weight : Number(weight)};
      if(!tagIndex[tag]){
        tags.push(tag);
        tagIndex[tag] = { tuples : [], cumulativeWeight : 0 };
      }
      tagIndex[tag].tuples.push(tuple);
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
  
  this.itemsForTag = function(tag, cutoff){
     if(!cutoff) cutoff = 10;
     return tagIndex[tag].tuples.filter(function(tuple){
        return tuple.weight > cutoff;
     }).map(function(tuple){
       return tuple.item;
     });
  }

}
