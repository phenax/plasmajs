
import http from 'http';
import https from 'https';
import mime from 'mime';
import fs from 'fs';
import {
	createGzip,
	createDeflate
} from 'zlib';

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

	// Extend the response with additional functionality
	_wrapResponse(req, res) {

		return Object.assign(res, {

			respondWith(str, type) {
				res.writeHead(200, { 'Content-Type': type });
				res.end(str);
			},

			// For plain-text responses
			text(str) {
				res.respondWith(str, mime.lookup('a.txt'));
			},

			// For html resonses
			send(str) {
				res.respondWith(str, mime.lookup('a.html'));
			},

			// For json responses
			json(obj) {
				res.respondWith(JSON.stringify(obj), mime.lookup('a.json'));
			},

			// XML response
			xml() {
				// TODO: Fix the mime-type
				res.respondWith(str, mime.lookup('a.xml'));
			},

			compressStream(stream$, getCompressionType) {

				const compressionType= getCompressionType();

				// If compression is supported
				if(compressionType) {

					res.writeHead(200, { 'Content-Encoding': compressionType });

					const outer$= (compressionType === 'gzip')? createGzip(): createDeflate();

					return stream$.pipe(outer$);
				}

				return stream$;
			},

			// For sending files
			sendFile(fileName, config={}) {

				return new Promise((resolve, reject) => {

					// If the file wasnt found, stop here and let the router handler stuff
					let fileStream$= fs.createReadStream(fileName);

					// Set the mime-type of the file requested
					res.writeHead(200, { 'Content-Type': mime.lookup(fileName) || 'text/plain' });

					// The file was found
					resolve();

					// If it needs compression, compress it
					if(config.compress) {
						fileStream$= res.compressStream(fileStream$, config.compress);
					}

					// pipe the file out to the response
					fileStream$.pipe(res);
				});
			}
		});
	}


	// Request callback
	_requestHandler(req, res, reqCallback) {

		const response= this._wrapResponse(req, res);

		// Callback
		reqCallback(req, response);

		process.nextTick( _ => {

			// Render the template
			const markup= renderTemplate(this._App, {
				request: req,
				response: response,
				port: this.port
			});

			if(!response.hasTerminated && markup)
				response.send(markup);
		});
	}
}
