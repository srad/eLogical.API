# eLogical API

[![Build Status](http://sedrad.com:8080/buildStatus/icon?job=eLogical.API)](http://sedrad.com:8080/job/eLogical.API/)

It's build on following components:
1. This app is base on [Express](https://www.npmjs.com/package/express).
1. Azure Cosmos DB (MongoDB protocol compatible).
1. Mongoose as client for the database.

## Quick Start

The quickest way to get started with express is to utilize the executable `express(1)` to generate an application as shown below:

Install dependencies:

```bash
$ npm install
```

Set node.js environment variables

These environment variables are required in deployment (connection string is a Cosmos DB connection string).

```bash
CONNECTION_STRING
PORT
SECRET
NODE_ENV
```

In local development only `CONNECTION_STRING` is required.

Start your Express.js app, with the default port `http://localhost:3000/`:

```bash
$ npm start
```

## Deployment
