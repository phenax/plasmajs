
import http from 'http';
import https from 'https';
import mime from 'mime';
import fs from 'fs';

import { createElement, Component } from 'react';

import { renderTemplate } from './lib/helper.jsx';

// Router
export * from './router/server.jsx';

// MiddleWare super class
export * from './MiddleWare.jsx';

// Default middlewares
export * from './middlewares/APIRouter.jsx';
export * from './middlewares/StaticContentRouter.jsx';
export * from './middlewares/Logger.jsx';
// export * from './middlewares/Compressor.jsx';
export * from './middlewares/ServiceWorkers.jsx';




// Wrapping element for the configuration(Doesnt do for now)
export class Server extends Component {

	render() {

		// All middlewares that have called the .terminate()
		const $terminalComponents=
			this.props.children
				.filter( val => val.isTerminalResponse );
		
		// If atleast one middleware has called the .terminate, return null;
		if($terminalComponents.length > 0)  {
			return null;
		}

		// Else wrap the childern in an html element and render
		return createElement('html', this.props.html || {}, this.props.children);
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



///// EXPERIMENT

	// Send the file contents to the server
	sendFileContents() {

		try {

			// If the file wasnt found, stop here and let the router handler stuff
			let fileStream$= this.fetchFileContents(this.props.request.url);

			// Stop rendering other stuff because this is the stuff needed
			this.terminate();

			// Set the mime-type of the file requested
			this.props.response
				.setHeader(
					'Content-Type', 
					mime.lookup(this.props.request.url) || 'text/plain'
				);

			// Wrapper for the response stream
			fileStream$= this._compressStream(fileStream$);

			fileStream$.pipe(this.props.response);

		} catch(e) { if(this.hadPrefix) console.log(e); }
	}


///////////////////////////////////////////////////////



	// Extend the response with additional functionality
	_wrapResponse(req, res) {

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

			compressStream(stream$) {

				return stream$;
			},

			// For sending files
			sendFile(fileName, config) {

				config= config || {};
				config.error= config.error || (()=> {});
				config.success= config.success || (()=> {});

				try {

					// If the file wasnt found, stop here and let the router handler stuff
					let fileStream$= fs.createReadStream(fileName);

					// The file was found without any errors
					config.success();

					// Set the mime-type of the file requested
					res.setHeader(
						'Content-Type', 
						mime.lookup(fileName) || 'text/plain'
					);

					if(config.compress) {
						fileStream$= res.compressStream(fileStream$);
					}

					fileStream$.pipe(res);

				} catch(e) {
					config.error(e);
				}
			}
		});
	}


	// Request callback
	_requestHandler(req, res, reqCallback) {

		const response= this._wrapResponse(req, res);

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
