// stores timestamped revisions for anything which is text(or can be text encoded)
// this was created to create a simple version history for CodeMirror, but can be
// applied to other editors or objects.
(function() {

  // create a new local revision object
  //
  //   `key` a unique name to identify the revision history
  //
  //   `getValue` function which returns the current value of the text to track
  //
  //   `setValue` a function which sets the text value you are tracking.  Used to revert
  //   to a previous revision.
  function LocalRevision(key, getValue, setValue){
    this.getValue = getValue;
    this.setValue = setValue;
    this.key = key;
  }

  // returns an index of revision keys
  // each revision is stored as a `key`-`timestamp`
  LocalRevision.prototype.index = function(){
    var i = (storage.getItem(this.key) || "").split(","); // index is stored as CSV
    if(i[0].length === 0){i.shift();}                     // strip out the first empty item
    return i;
  }

  // Creates a new revision, if the value has changed from the previous value.
  //
  // Returns the indexKey on success, false if there is no change.
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

  // returns the text of the last revision
  LocalRevision.prototype.lastRevision = function(){
    var keys = this.index();
    return storage.getItem(keys[keys.length -1]);
  }

  // returns the text of the revision
  LocalRevision.prototype.read = function(index){
    var text = storage.getItem(index);
    this.setValue(text);
    return index;
  }

  // removes all revisions for this object
  LocalRevision.prototype.clear = function(){
    var revisions = this.index();
    for(var i = 0; i < revisions.length; i++){
      storage.removeItem(revisions[i])
    }
    storage.removeItem(this.key);
  }

  var storage = window.localStorage;

  // private function for creating a new index
  function addIndex(){
    var timestamp = this.key + "-" + new Date().getTime(),
        index     = this.index();

    index.push(timestamp);
    storage.setItem(this.key, index.join(","));
    return timestamp;
  }

  window.LocalRevision = LocalRevision;

}());

// ## TODO
// * maxRevisions to limit how many revisions are stored
// * use `storage` event to allow documents in other windows to gain sync
