# PlasmaJS

[![Build Status](https://travis-ci.org/phenax/plasmajs.svg?branch=master)](https://travis-ci.org/phenax/plasmajs)
[![npm version](https://img.shields.io/npm/v/plasmajs.svg)](https://www.npmjs.com/package/plasmajs)
[![license](https://img.shields.io/npm/l/plasmajs.svg)](https://github.com/phenax/plasmajs/blob/master/LICENSE)
[![dependency status](https://david-dm.org/phenax/plasmajs/status.svg)](https://david-dm.org/phenax/plasmajs)
[![Discord](https://img.shields.io/discord/425972740688838656.svg)](https://discord.gg/b9Z4b6r)

[![NPM](https://nodei.co/npm/plasmajs.png?downloadRank=true)](https://www.npmjs.com/package/plasmajs)

An isomorphic NodeJS framework powered with React for building web apps.

**[Use the starter-kit to get up and running with PlasmaJS](https://github.com/phenax/plasmajs-starter-kit) [OUTDATED]**

**[Join us on discord](https://discord.gg/b9Z4b6r)**

<br />

## Features

* Declarative syntax
* Isomorphic routing
* Isolated routing for API endpoints
* Maintainable middlewares
* ES6 syntax with babel

<br />

## Installation

* Install with npm `npm i --save plasmajs`(you can also install it globally with `npm i -g plasmajs`)
* To run the server, `plasmajs path/to/server.js`(Add it to your package.json scripts for local install)

<br />

## Guide

### Import it to your app.js

```javascript
import { Server, Route, Router, NodeHistoryAPI } from 'plasmajs';
```

### Writing A Server

```javascript
const HeadLayout = props => (
  <head>
    <title>{props.title}</title>
  </head>
);
const WrapperLayout = props => <body>{props.children}</body>;
const HomeLayout = props => <div>Hello World</div>;
const ErrorLayout = props => <div>404 Not Found</div>;

export default class App extends React.Component {
  // Port number (Default=8080)
  static port = 8080;

  render() {
    const history = new NodeHistoryAPI(this.props.request, this.props.response);
    return (
      <Server>
        <HeadLayout title="Test" />
        <Router history={history} wrapper={WrapperLayout}>
          <Route path="/" component={HomeLayout} />
          <Route errorHandler={true} component={ErrorLayout} />
        </Router>
      </Server>
    );
  }
}
```

<br />

### Middlewares

#### Writing custom middlewares

In MyMiddleWare.jsx...

```javascript
import { MiddleWare } from 'plasmajs';

export default class MyMiddleWare extends MiddleWare {
  onRequest(req, res) {
    // Do your magic here
    // Run this.terminate() to stop the render and take over
  }
}
```

And in App's render method...

```html
<Server>

  <MyMiddleWare {...this.props} />

  // ...
</Server>
```

<br />

#### Logger middleware

It logs information about the request made to the server out to the console.

````javascript
import {Logger} from 'plasmajs' // and add it in the server but after the router declaration.
````
```html
<Server>
  // ...

  <Logger {...this.props} color={true} />
</Server>
```

* Props
  * `color` (boolean) - Adds color to the logs if true

<br />

#### StaticContentRouter middleware

Allows you to host a static content directory for public files

````javascript
import {StaticContentRouter} from 'plasmajs'
````
```html
<Server>
  <StaticContentRouter {...this.props} dir='public' hasPrefix={true} />

  // ...
</Server>
```

* Props
  * `dir` (string) - The name of the static content folder to host
  * `hasPrefix` (boolean) - If set to false, will route it as http://example.com/file instead of http://example.com/public/file
  * `compress` (boolean) - If true, will enable gzip compression on all static content if the client supports it

<br />

#### APIRoute middleware

Allows you to declare isolated routes for requests to api hooks

```javascript
  import {APIRoute} from 'plasmajs'
  
  //...
  // API request handler for api routes
  _apiRequestHandler() {

    // Return a promise
    return new Promise((resolve, reject) => {

      resolve({
        wow: "cool cool"
      });
    });
  }

  render() {
    return (
      <Server>
        <APIRoute {...this.props} method='POST' path='/api/stuff' controller={this._apiRequestHandler} />
        //...
      </Server>
    );
  }
```

* Props
  * `method` (string) - The http request method
  * `path` (string or regex) - The path to match
  * `controller` (function) - The request handler

<br />

### Routing

Isomorphic routing which renders the content on the server-side and then lets the javascript kick in and take over the interactions. (The server side rendering only works for Push State routing on the client side, not Hash routing).

`NOTE: Its better to isolate the route definitions to its own file so that the client-side and the server-side can share the components`

#### History API

There are 3 types of routing available - Backend routing(`new NodeHistoryAPI(request, response)`), Push State routing(`new HistoryAPI(options)`), Hash routing(`new HashHistoryAPI(options)`)(NOTE: The naming is just for consistency)

<br />

#### The Router

```html
<Router history={history} wrapper={Wrapper}>
  {allRouteDeclarations}
</Router>
```

* Props
  * `history` (object) - It's the history api instance you pass in depending on the kind of routing you require.
  * `wrapper` (React component class) - It is a wrapper for the routed contents

<br />

#### Declaring a route

If `Homepage` is a react component class and `/` is the url.

```html
<Route path='/' component={HomePage} />
```

* Props
  * `path` (string or regex) - The url to route the request to
  * `component` (React component class) - The component to be rendered when the route is triggered
  * `statusCode` (integer) - The status code for the response
  * `caseInsensitive` (boolean) - Set to true if you want the url to be case insensitive
  * `errorHandler` (boolean) - Set to true to define a 404 error handler


## Want to help?
PRs are welcome. You can also join us on [discord](https://discord.gg/b9Z4b6r) for discussions about plasmajs.
