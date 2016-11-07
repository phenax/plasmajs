import {PropTypes} from 'react';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import {
	createGzip,
	createDeflate
} from 'zlib';

import {MiddleWare} from '../MiddleWare.jsx';


/**
 * Middleware to host static content on the server
 */
export class StaticContentRouter extends MiddleWare {

	onRequest(req, res) {

		// Defaults to a directory called static in the project root
		this.publicDir= this.props.dir || 'static';

		// Defaults to true because its faster
		this.hasPrefix= (this.props.hasPrefix == null)? true: this.props.hasPrefix;


		// If the directory name if to be prefixed i.e. 
		// ./public will be hosted as http://domain.com/public/file
		// instead of
		// http://domain.com/file
		if(this.hasPrefix) {

			const publicPathRegex= new RegExp('^\/' + this.publicDir + '\/');

			// If the url starts with /${publicDir}/
			if(publicPathRegex.test(req.url)) {
				this.sendFileContents();
			}

		} else {
			this.sendFileContents();
		}
	}

	fetchFileContents(currentUrl) {

		// The base directory for the project i.e. root project directory
		const projectDir= path.resolve('.');

		// Read file and return string
		// TODO: Make this asynchronous (Stream maybe?)
		return fs.createReadStream(
		
			(this.hasPrefix) ?
				
				// Has prefix i.e. static content url will be /${publicDir}/whatever
				path.resolve(projectDir, './' + currentUrl ) :

				// No prefix i.e. static content url will be  /whatever
				path.resolve(projectDir, this.publicDir + '/' + currentUrl )
		);
	}

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

	_compressStream(stream$) {

		if(!this.props.compress) return stream$;

		const GZIP= 'gzip';
		const DEFL= 'deflate';

		let compressionType= null;

		const acceptEncoding = this.props.request.headers['accept-encoding'] || '';

		// Identify the compression supported
		if (acceptEncoding.includes(GZIP))
			compressionType= GZIP;
		else if (acceptEncoding.includes(DEFL))
			compressionType= DEFL;

		// If compression is supported
		if(compressionType) {

			this.props.response.writeHead(200, { 'Content-Encoding': compressionType });

			const outer$= (compressionType === GZIP)? createGzip(): createDeflate();

			return stream$.pipe(outer$);
		}

		return stream$;
	}
}





StaticContentRouter.propTypes= {

	dir: PropTypes.string.isRequired,

	hasPrefix: PropTypes.bool,

	compress: PropTypes.bool
}
