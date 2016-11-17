import React from 'react';

// Super class for creating middlewares
export class MiddleWare extends React.Component {

	constructor(props) {
		super(props);
		
		this.isMiddleWare= true;
		this.isTerminalResponse= false;

		if(this.onRequest)
			this.onRequest(this.props.request, this.props.response);
		else
			throw new Error("Middlewares need an onRequest method defined");
	}

	terminate() {

		this.props.response.hasTerminated= true;
		this.isTerminalResponse= true;
	}

	render() { return null }
}

MiddleWare.propTypes= {
	request: React.PropTypes.object.isRequired,
	response: React.PropTypes.object.isRequired
}
