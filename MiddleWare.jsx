import React from 'react';
import PropTypes from 'prop-types';

// Super class for creating middlewares
export class MiddleWare extends React.Component {

	isMiddleWare = true;
	isTerminalResponse = false;

	constructor(props) {
		super(props);

		if(typeof this.onRequest === 'function') {
			this.onRequest.call(this, this.props.request, this.props.response);
		} else {
			throw new Error('Middlewares need an onRequest method defined');
		}
	}

	terminate() {
		this.props.response.hasTerminated = true;
		this.isTerminalResponse = true;
	}

	render() { return null; }
}

MiddleWare.propTypes = {
	request: PropTypes.object.isRequired,
	response: PropTypes.object.isRequired
}
