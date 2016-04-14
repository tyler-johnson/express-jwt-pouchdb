#!/bin/bash

# install pouchdb from git master rather than npm,
# so we can run its own tests
rm -fr node_modules/pouchdb
git clone --depth 1 --single-branch --branch master \
  https://github.com/pouchdb/pouchdb.git node_modules/pouchdb

cd node_modules/pouchdb/
npm install

cd ../..

node cli.js -p 6984 $SERVER_ARGS &
EJP_SERVER_PID=$!

cd node_modules/pouchdb/

COUCH_HOST=http://localhost:6984 npm test

EXIT_STATUS=$?
if [[ ! -z $EJP_SERVER_PID ]]; then
  kill $EJP_SERVER_PID
fi
exit $EXIT_STATUS
