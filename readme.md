## Le Problem
Asynchronous init can be a pain to work with. For example, look at the following code.

```js
const db = require('some-database-library');
db.init(function callback(){
	console.log('init done!');
});
exports.getUser = function(callback) {
	db.query('user', callback);
};
```

The flaw of this code is that any getUser function call before the init is finished will fail. This is the problem we try to solve.

## Example
```js
const init = require('async-init').create();
const db = require('some-database-library');
db.init(init.done);

const db2 = init.wrapAll(db);
exports.getUser = function(callback) {
	//here db.query will be called after db.init is completed.
	db2.query('user' ,callback);
};
```

## API

#### init.done
Call this function when the init is done.

#### init.wrapAll(object)
Create a new wrapper object delegating all functions call until after the init is done. Non-function properties are copied over.

#### init.wrap(object, functionName:string)
Return a single wrapping function.
