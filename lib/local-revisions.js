(function() {
  // saves a timestamped version of the document to localStoreage
  // requires that localRevisionsKey be named
  // TODO
  // maxRevisions sets how many revisions will be saved

  var storage = window.localStorage;

  var addIndex = function(){
    var timestamp = this.key + "-" + new Date().getTime(),
        index     = this.index();

    index.push(timestamp);
    storage.setItem(this.key, index.join(","));
    return timestamp;
  }

  function LocalRevision(key, getValue, setValue){
    this.getValue = getValue;
    this.setValue = setValue;
    this.key = key;
  }

  LocalRevision.prototype.index = function(){
    var i = (storage.getItem(this.key) || "").split(",");
    if(i[0].length == 0){i.shift();} // strip out the first empty item
    return i;
  }

  LocalRevision.prototype.write = function(){
    var lastValue = this.lastRevision(),
        newValue  = this.getValue(),
        timestamp;

    if(lastValue != newValue){
      timestamp = addIndex.apply(this);
      storage.setItem(timestamp, newValue);
      return timestamp;
    } else {
      return false;
    }
  }

  LocalRevision.prototype.lastRevision = function(){
    var keys = this.index();
    return storage.getItem(keys[keys.length -1]);
  }

  LocalRevision.prototype.read = function(index){
    var text = storage.getItem(index);
    this.setValue(text);
    return index;
  }

  LocalRevision.prototype.clear = function(){
    var revisions = this.index();
    for(var i = 0; i < revisions.length; i++){
      storage.removeItem(revisions[i])
    }
    storage.removeItem(this.key);
  }

  // TODO break this out
  CodeMirror.defineExtension("localRevision", function(key) {
    var editor = this,
        get    = function(){ return editor.getValue()},
        set    = function(x){ return editor.setValue(x)};

    return new LocalRevision(key,get,set);
  });
}());
