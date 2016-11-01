import {PropTypes} from 'react';
import fs from 'fs';
import path from 'path';

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
				console.log("public start");
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
		// TODO: Make this asynchronous with streams
		return fs.readFileSync(
		
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
			let contents= this.fetchFileContents(this.props.request.url);

			this.terminate();

			this.props.response.end(contents);

		} catch(e) { }
	}
}

StaticContentRouter.propTypes= {

	dir: PropTypes.string.isRequired,

	hasPrefix: PropTypes.bool
}
