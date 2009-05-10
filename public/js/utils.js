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

