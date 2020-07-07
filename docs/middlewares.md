## Middlewares

### How to Write custom middlewares 

You need to access to my MyMiddleWare.jsx and introduce this code: 
```javaScript 
	import { MiddleWare } from 'plasmajs';

	export default class MyMiddleWare extends MiddleWare {
	  onRequest(req, res) {
	    // Do your magic here
	    // Run this.terminate() to stop the render and take over
	  }
	}
```
And in App's render method...
```javaScript 
	<Server>

	  <MyMiddleWare {...this.props} />

	  // ...
	</Server>
```
### How to  create a logger middleware: 

#### It logs information about the request made to the server out to the console.
```javaScript 
import {Logger} from 'plasmajs' // and add it in the server but after the router declaration.

	<Server>
	  <Logger {...this.props} color={true} />
	</Server>
```
- Props

  - color (boolean) - Adds color to the logs if true

### StaticContentRouter middleware:

#### Allows you to host a static content directory for public files
```javaScript 
	import {StaticContentRouter} from 'plasmajs'
	<Server>
	  <StaticContentRouter {...this.props} dir='public' hasPrefix={true} />

	  // ...
	</Server>
```
- Props

  - dir (string) - The name of the static content folder to host

  - hasPrefix (boolean) - If set to false, will route it as http://example.com/file instead of http://example.com/public/file

  - compress (boolean) - If true, will enable gzip compression on all static content if the client supports it

### How to create an APIRoute middleware

#### Allows you to declare isolated routes for requests to api hooks
```javaScript 
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
- Props: 
  
  - method (string) - The http request method
  
  - path (string or regex) - The path to match
  
  - controller (function) - The request handler

