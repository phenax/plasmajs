import React from 'react';

import { MiddleWare } from '../MiddleWare.jsx';

import { checkUrlMatch } from '../lib/helper.jsx';

export class APIRoute extends MiddleWare {

	onRequest(req, res) {

		if(checkUrlMatch(this.props.path, req.url)) {

			this.triggerAPIResponse(res);
		}
	}


	triggerAPIResponse(res) {

		this.terminate();

		const emitError= (e) => {

			res.statusCode= 500;

			res.json(e || {});
		};

		res.statusCode= 200;
	
		if(this.props.controller) {

			const callbackHandler= (data) => res.json(data || {});

			this.props.controller(callbackHandler, emitError);

		} else {

			emitError({
				error: 'You need to specify the controller for the APIRoute'
			});
		}
	}
}

APIRoute.propTypes= {

	controller: React.PropTypes.func.isRequired,
};