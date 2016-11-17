// import fs from 'fs';
// import mime from 'mime';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Render react components(only server-side)
export function renderTemplate(Element, props={}) {

	const renderedContent= renderToStaticMarkup(<Element {...props} />);

	if(renderedContent == null)
		return null;

	let html= '<!doctype html>';

	html+= renderedContent;

	return html;
}

// Route matching
export function checkUrlMatch(url, reqUrl, method1='GET', method2='GET') {

	let isAMatch= false;

	if(typeof(url.test) === 'function') {

		isAMatch= url.test(reqUrl);

	} else if(typeof(url) === 'string') {

		isAMatch= url === reqUrl;

	}

	// Does the method name match?
	if(isAMatch) {
		if(method1.toLowerCase() !== method2.toLowerCase())
			isAMatch= false;
	}

	return isAMatch;
}

// Extend the response with additional functionality
// export function extendResponse(req, res) {

// 	return Object.assign(res, {

// 		respondWith(str, type) {
// 			res.writeHead(200, { 'Content-Type': type });
// 			res.end(str);
// 		},

// 		// For plain-text responses
// 		text(str) {
// 			res.respondWith(str, mime.lookup('a.txt'));
// 		},

// 		// For html resonses
// 		send(str) {
// 			res.respondWith(str, mime.lookup('a.html'));
// 		},

// 		// For json responses
// 		json(obj) {
// 			res.respondWith(JSON.stringify(obj), mime.lookup('a.json'));
// 		},

// 		// XML response
// 		xml() {
// 			// TODO: Fix the mime-type
// 			res.respondWith(str, mime.lookup('a.xml'));
// 		},

// 		compressStream(stream$, getCompressionType) {

// 			const compressionType= getCompressionType();

// 			// If compression is supported
// 			if(compressionType) {

// 				res.writeHead(200, { 'Content-Encoding': compressionType });

// 				const outer$= (compressionType === 'gzip')? createGzip(): createDeflate();

// 				return stream$.pipe(outer$);
// 			}

// 			return stream$;
// 		},

// 		// For sending files
// 		sendFile(fileName, config={}) {

// 			return new Promise((resolve, reject) => {

// 				// If the file wasnt found, stop here and let the router handler stuff
// 				let fileStream$= fs.createReadStream(fileName);

// 				// Set the mime-type of the file requested
// 				res.statusCode= 200;
// 				res.setHeader('Content-Type', mime.lookup(fileName) || 'text/plain');

// 				// The file was found
// 				resolve();

// 				// If it needs compression, compress it
// 				if(config.compress) {
// 					fileStream$= res.compressStream(fileStream$, config.compress);
// 				}

// 				// pipe the file out to the response
// 				fileStream$.pipe(res);
// 			});
// 		}
// 	});
// }