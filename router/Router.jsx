import React from 'react';
import PropTypes from 'prop-types';

import _HnRouteHistoryAPI from './history/_HnRouteHistoryAPI.jsx';

import assign from 'lodash/assign';
import constant from 'lodash/constant';
import filter from 'lodash/filter';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';

// Error components
const DEFAULTERROR = 'Something went wrong';
const NULLCOMPONENTERROR = 'The component cannot be null';
const HISTORYTYPEERROR =
  'The prop `history` has to be an instance of either HistoryAPI or NodeHistoryAPI';

/**
 * Route declaration component
 */
export class Route extends React.Component {
  static propTypes = {
    caseInsensitive: PropTypes.bool,
    statusCode: PropTypes.number,
    errorHandler: PropTypes.bool,
    controller: PropTypes.func,
    method: PropTypes.string,
    component: PropTypes.func.isRequired,
  };
  render = constant(null);
}

/**
 * Router wrapper
 */
export class Router extends React.Component {
  static propTypes = {
    wrapper: PropTypes.func,
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
  };

  _EMPTY_ROUTER = <Route component={constant(null)} />;

  constructor(props) {
    super(props);

    this.state = { currentUrl: '/' };

    this._routes = map(
      filter(this.props.children, { type: this._EMPTY_ROUTER.type }),
      'props',
    );

    if (!(this.props.history instanceof _HnRouteHistoryAPI))
      throw new Error(HISTORYTYPEERROR);
  }

  // Life cycle methods only executes on the client-side
  componentDidMount() {
    this.props.history.routeChangeListener(data =>
      this.setState({ currentUrl: data.url }),
    );
  }

  componentWillUnmount() {
    this.props.history.removeChangeListener();
  }

  render() {
    const { props: { history, wrapper } } = this;
    if (history.response && history.response.hasTerminated) {
      return null;
    }

    const route = history.matchRoute(this._routes);

    if (!route) {
      throw new Error(DEFAULTERROR);
    }

    if (!route.$component) {
      throw new Error(NULLCOMPONENTERROR);
    }

    // The default props
    let defaultProps = {
      routerProps: {
        url: this.state.currentUrl,
        location: history.location,
      },
    };

    // Call the router controller
    if (route.controller) {
      route.controller(_props => (defaultProps = assign(defaultProps, _props)));
    }

    // Either render the route component or wrap it in a wrapper and render
    let $reactElement = route.$component;

    // If it's on the serverside and the wrapper is a function
    if (history.response && isFunction(wrapper)) {
      const Wrapper = wrapper;
      $reactElement = <Wrapper>{route.$component}</Wrapper>;
    }

    return React.cloneElement($reactElement, defaultProps);
  }
}
