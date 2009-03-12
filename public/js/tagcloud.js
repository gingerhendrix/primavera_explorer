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
