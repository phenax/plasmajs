import {PropTypes} from 'react';
import fs from 'fs';
import path from 'path';

import {MiddleWare} from '../MiddleWare.jsx';

export class StaticContentRouter extends MiddleWare {

	onRequest(req, res) {

		this.publicDir= this.props.dir || 'static';
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

	fetchFileContents() {
		const projectDir= path.resolve('.');
		console.log(path.resolve(projectDir, './'+this.props.request.url ));
		console.log(path.resolve(projectDir, this.publicDir + '/' + this.props.request.url ));

		// TODO: Set for prefixes
		return fs.readFileSync(
			(this.hasPrefix) ?
				path.resolve(projectDir, './'+this.props.request.url ) :                     // Has prefix i.e. static content url will be /${publicDir}/whatever
				path.resolve(projectDir, this.publicDir + '/' + this.props.request.url )     // No prefix i.e. static content url will be  /whatever
		);
	}

	sendFileContents() {

		try {

			let contents= this.fetchFileContents();

			this.terminate();

			this.props.response.end(contents);

		} catch(e) {
			console.log("File not found");
		}
	}
}

StaticContentRouter.propTypes= {

	dir: PropTypes.string.isRequired,

	hasPrefix: PropTypes.bool
}
