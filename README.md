# express-jwt-pouchdb

[![npm](https://img.shields.io/npm/v/express-jwt-pouchdb.svg)](https://www.npmjs.com/package/express-jwt-pouchdb) [![David](https://img.shields.io/david/tyler-johnson/express-jwt-pouchdb.svg)](https://david-dm.org/tyler-johnson/express-jwt-pouchdb) [![Build Status](https://travis-ci.org/tyler-johnson/express-jwt-pouchdb.svg?branch=master)](https://travis-ci.org/tyler-johnson/express-jwt-pouchdb)

[Express-PouchDB](http://ghub.io/express-pouchdb) clone with [JSON Web Token](https://jwt.io) support. This is designed to mimic the [couch_jwt_auth](https://github.com/softapalvelin/couch_jwt_auth) plugin for CouchDB so it can serve as a testing server. Configuration and usage matches that plugin.

## Usage

Install with NPM:

```sh
npm i express-jwt-pouchdb --save
```

And use just like you would express-pouchdb:

```js
var express = require("express"),
    app     = express(),
    PouchDB = require("pouchdb");

app.use("/db", require("express-jwt-pouchdb")(PouchDB));

app.listen(3000);
```
