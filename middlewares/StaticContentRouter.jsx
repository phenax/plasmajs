import {PropTypes} from 'react';
import fs from 'fs';
import path from 'path';

import {MiddleWare} from '../MiddleWare.jsx';

export class StaticContentRouter extends MiddleWare {

	onRequest(req, res) {

		this.publicDir= this.props.public || 'static';

		if(this.props.hasPrefix) {

			if(req.url.split('/')[1] === this.publicDir)
				this.sendFileContents();

		} else {
			this.sendFileContents();
		}
	}

	fetchFileContents() {

		return fs.readFileSync(path.resolve('.' + this.props.request.url));
	}

	sendFileContents() {

		try {

			let contents= this.fetchFileContents();

			this.terminate();

			this.props.response.end(contents);

		} catch(e) {
			// console.log("File not found");
		}
	}
}

StaticContentRouter.propTypes= {

	public: PropTypes.string,

	hasPrefix: PropTypes.bool
}
