import React from 'react';
import PropTypes from 'prop-types';

import { MiddleWare } from '../MiddleWare';

import { checkUrlMatch } from '../lib/helper';

export class ServiceWorker extends MiddleWare {
  onRequest() {}

  constructor(props) {
    super(props);

    this.successScript =
      this.props.success ||
      (() => console.log('Service Worker was registered successfully'));
    this.errorScript =
      this.props.error ||
      (e => console.warn('Service worker registration failed ', e));
    this.swPathName = this.props.path || '/serviceWorker.js';
  }

  serviceWorkerRequestHandler() {
    if (checkUrlMatch(this.props.request.url, this.swPathName)) {
      this.terminate();

      const serviceWorkerScript = '';

      this.props.response.respondWith(
        serviceWorkerScript,
        'application/javascript',
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
      <script
        dangerouslySetInnerHTML={{
          __html: this.serviceWorkerRegScript(),
        }}
      />
    );
  }
}

ServiceWorker.propTypes = {
  path: PropTypes.string,
  success: PropTypes.func,
  error: PropTypes.func,
};

export class SWToolboxFast extends React.Component {}
