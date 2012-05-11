// LocalRevision extension for CodeMirror
(function(){
  CodeMirror.defineExtension("localRevision", function(key) {
    var editor = this,
        get    = function(){ return editor.getValue()},
        set    = function(x){ return editor.setValue(x)};

    return new LocalRevision(key,get,set);
  });
}());
