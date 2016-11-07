
import http from 'http';
import https from 'https';
import { createElement, Component } from 'react';

import { renderTemplate } from './lib/helper.jsx';

// Router
export * from './router/Router.jsx';

// MiddleWare super class
export * from './MiddleWare.jsx';

// Default middlewares
export * from './middlewares/APIRouter.jsx';
export * from './middlewares/StaticContentRouter.jsx';
export * from './middlewares/Logger.jsx';
export * from './middlewares/Compressor.jsx';




// Wrapping element for the configuration(Doesnt do for now)
export class Server extends Component {

	render() {

		const $terminalComponents=
			this.props.children
				.filter( val => val.isTerminalResponse );
		
		if($terminalComponents.length > 0)  {
			return null;
		}

		return createElement('html', {}, this.props.children);
	}
}


// Http(s) server wrapper
export class NodeServer {

	constructor(App) {

		this._App= App;
		this.port= this._App.port || process.env.PORT || 8080;
		this.config= (this._App.config && this._App.config.https)? this._App.config: null;

		this._requestHandler= this._requestHandler.bind(this);
	}


	// Create a new server
	createServer(reqCB= ()=>{}) {

		// If the config is not null, create an https server
		// Else, create a http server
		if(this.config) {                                             // HTTPS server

			this.server= https.createServer(
				this.config,
				(req, res) => this._requestHandler(req, res, reqCB)
			);

		} else {                                                      // HTTP server

			this.server= http.createServer(
				(req, res) => this._requestHandler(req, res, reqCB)
			);
		}

		return this;
	}

	// Start the server
	start() {
		
		return new Promise((resolve, reject) => {
			
			this.server.listen(this.port, _ => {
				
				console.log(`Listening on port ${this.port}...`);
				
				resolve(_);
			});
		});
	}

	// Extend the response with additional functionality
	_wrapResponse(res) {

		return Object.assign(res, {

			respondWith(str, type) {
				res.setHeader('Content-Type', type);
				res.end(str);
			},

			// For plain-text responses
			text(str) {
				res.respondWith(str, 'text/plain');
			},

			// For html resonses
			send(str) {
				res.respondWith(str, 'text/html');
			},

			// For json responses
			json(obj) {
				res.respondWith(JSON.stringify(obj), 'application/json');
			},

			// XML response
			xml() {
				// TODO: Fix the mime-type
				res.respondWith(str, 'text/plain');
			},
		});
	}


	// Request callback
	_requestHandler(req, res, reqCallback) {

		const response= this._wrapResponse(res);

		// Callback
		reqCallback(req, res);


		// Render the template
		const markup= renderTemplate(this._App, {
			request: req,
			response: response,
			port: this.port
		});

		if(!response.hasTerminated && markup)
			res.end(markup);
	}
}
