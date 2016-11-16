import React from 'react';

import { MiddleWare } from '../MiddleWare.jsx';

import { checkUrlMatch } from '../lib/helper.jsx';

export class ServiceWorker extends MiddleWare {

	onRequest() { }

	constructor(props) {
		super(props);

		this.successScript = this.props.success || (()=> console.log("Service Worker was registered successfully"));
		this.errorScript   = this.props.error   || (()=> console.warn("Service worker registration failed ", error));
		this.swPathName    = this.props.path    || '/serviceWorker.js';
	}

	serviceWorkerRequestHandler() {

		if(checkUrlMatch(this.props.request.url, this.swPathName)) {

			this.terminate();

			const serviceWorkerScript= '';

			this.props.response.respondWith(
				serviceWorkerScript,
				'application/javascript'
			);
		}
	}

	serviceWorkerRegScript() {

		return `
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${this.swPathName}')
					.then(${this.successScript.toString()})
					.catch(${this.errorScript.toString()});
			}
		`.replace(/\s+/gi, ' ');
	}

	render() {

		this.serviceWorkerRequestHandler();

		return (
			<script dangerouslySetInnerHTML={{
				__html: this.serviceWorkerRegScript()
			}} />
		);
	}
}

ServiceWorker.propTypes= {

	path: React.PropTypes.string,

	success: React.PropTypes.func,
	error: React.PropTypes.func,
};


export class SWToolboxFast extends React.Component {

}
