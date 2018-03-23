import React from 'react';
import PropTypes from 'prop-types';

import { MiddleWare } from '../MiddleWare';

import { checkUrlMatch } from '../lib/helper';

export class APIRoute extends MiddleWare {
  onRequest() {
    this.emitError = this.emitError.bind(this);
    this.emitResponse = this.emitResponse.bind(this);

    if (
      checkUrlMatch(
        this.props.path,
        this.props.request.url,
        this.props.request.method,
        this.props.method,
      )
    ) {
      this.triggerAPIResponse();
    }
  }

  emitError(e = {}) {
    this.hasResponded = true;

    this.props.response.statusCode = e.statusCode || 500;

    this.props.response.json(e);
  }

  emitResponse(data = {}) {
    this.hasResponded = true;

    this.props.response.json(data);
  }

  triggerAPIResponse() {
    this.terminate();

    this.props.response.statusCode = 200;

    if (this.props.controller) {
      this.hasResponded = false;

      const promise = this.props.controller(this.emitResponse, this.emitError);

      if (!this.hasResponded && promise)
        promise.then(this.emitResponse).catch(this.emitError);
    } else {
      this.emitError({
        error: 'You need to specify the controller for the APIRoute',
      });
    }
  }
}

APIRoute.propTypes = {
  controller: PropTypes.func.isRequired,
};
