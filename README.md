# eLogical API

[![Build Status](http://sedrad.com:8080/buildStatus/icon?job=eLogical.API)](http://sedrad.com:8080/job/eLogical.API/)

This is the web service for [eLogical](https://github.com/srad/eLogical.API)

It's build on following components:

1. This app is base on [Express](https://www.npmjs.com/package/express).
1. Used first Azure Cosmos DB, then switched to MongoDB protocol. First is protocol compatible.
1. Mongoose as client for the database.

## Quick Start

```bash
$ git clone https://github.com/srad/eLogical.API.git
$ cd eLogical.API
$ npm install
```

These environment variables are used in deployment.

```bash
CONNECTION_STRING
PORT
SECRET
NODE_ENV
```

But the only necessary one is the mongodb `CONNECTION_STRING`

```bash
$ npm start
```
