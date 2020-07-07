# Getting Started with PlasmaJs:

## PlasmaJs is an isomorphic NodeJS framework powered with React for building web apps.


### 1) Features of PlasmaJs:

	- Declarative syntax
	- Isomorphic routing
	- Isolated routing for API endpoints
	- Maintainable middlewares
	- ES6 syntax with babel


### 2) How to install PlasmaJs: 

	- Install with:
 
	npm npm i --save plasmajs (you can also install it globally with npm i -g plasmajs)

	- To run the server, plasmajs path/to/server.js (Add it to your package.json scripts for local install)

### 3) Plasma Js guide of use 

 - Import PlasmaJs to your app.js
```javaScript 
	   import { Server, Route, Router, NodeHistoryAPI } from 'plasmajs';
```
 - Writing A Server
```javaScript 
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
