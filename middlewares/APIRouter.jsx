import React from 'react';

import { MiddleWare } from '../MiddleWare.jsx';

import { checkUrlMatch } from '../lib/helper.jsx';

export class APIRoute extends MiddleWare {

	onRequest() {

		this.emitError= this.emitError.bind(this);
		this.emitResponse= this.emitResponse.bind(this);

		if(checkUrlMatch(this.props.path, this.props.request.url)) {

			this.triggerAPIResponse();
		}
	}

	emitError(e) {

		this.hasResponded= true;

		this.props.response.statusCode= 500;

		this.props.response.json(e || {});
	}

	emitResponse(data) {
		
		this.hasResponded= true;
		
		this.props.response.json(data || {})
	}

	triggerAPIResponse() {

		this.terminate();

		this.props.response.statusCode= 200;
	
		if(this.props.controller) {

			this.hasResponded= false;

			const promise= this.props.controller(this.emitResponse, this.emitError);

			if(!this.hasResponded && promise)
				promise
					.then(this.emitResponse)
					.catch(this.emitError);

		} else {

			this.emitError({
				error: 'You need to specify the controller for the APIRoute'
			});
		}
	}
}

APIRoute.propTypes= {

	controller: React.PropTypes.func.isRequired,
};