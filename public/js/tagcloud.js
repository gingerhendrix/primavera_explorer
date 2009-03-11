/**
  * A weighted list of tags.
  *
  */
function TagCloud(){
  var tags = [];
  var tagWeights = {};
  
  this. addTag = function(tag, weight){
    tags.push(tag);
    tagWeights[tag] = weight;
  }

  this.sort = function(){
   tags = tags.sort(function(t1, t2){
      return (tagWeights[t1] > tagWeights[t2]) ? -1 : 1;
    });
  }
  
  this.topTags = function(count){
   this.sort();
   return tags.slice(0, count);
  }

}
