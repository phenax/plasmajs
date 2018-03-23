import React from 'react';
import PropTypes from 'prop-types';
import constant from 'lodash/constant';
import isFunction from 'lodash/isFunction';

// Super class for creating middlewares
export class MiddleWare extends React.Component {
  isMiddleWare = true;
  isTerminalResponse = false;

  constructor(props) {
    super(props);

    if (isFunction(this.onRequest)) {
      const { props: { request, response } } = this;
      this.onRequest.call(this, request, response);
    } else {
      throw new Error('Middlewares need an onRequest method defined');
    }
  }

  terminate() {
    this.props.response.hasTerminated = true;
    this.isTerminalResponse = true;
  }

  render = constant(null);
}

MiddleWare.propTypes = {
  request: PropTypes.object.isRequired,
  response: PropTypes.object.isRequired,
};
