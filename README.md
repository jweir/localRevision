# LocalRevision

A simple version control for web browsers.

`localStorage` is used to save revisions for a given `key.`

There is no diffing – the entire text(or value) is stored.  Although if there is no
change with the previous version a `save` will abort.

This version is tied to CodeMirror, but that will change.

TODO

*  generate documentation
  * explain keys
*  decople from CodeMirror
*  Create TextArea demo
*  demo the use of storage events and explain the advantage of keeping fields in synch
