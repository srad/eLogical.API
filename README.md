# eLogical API

![TeamCity build status](https://teamcity.sedrad.com/app/rest/builds/buildType:id:ELogicalApi_Build/statusIcon.svg)

This is the API for the PWA [eLogical](https://github.com/srad/eLogical) and only takes REST
requests and authenticates client with JWT.

It's build on following components:

1. This app is base on [Express](https://www.npmjs.com/package/express).
1. As the databaase first Azure Cosmos DB has been used and works well. Then switching to MongoDB protocol.
1. Mongoose as client for the database (works with Cosmos DB and Monogo).

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

But the only necessary one is the mongodb `CONNECTION_STRING`. If you have a MongoDB instance running on your local machine set the environment variable, i.e. in PowerShell:

```powershell
$env:CONNECTION_STRING="mongodb://localhost:27017/elogical"
```
Run the server:

```bash
$ npm start
```
