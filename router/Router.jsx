
import React from 'react';

import _HnRouteHistoryAPI from './history/_HnRouteHistoryAPI.jsx';

export * from './history';
export * from './components';

// Error components
const DEFAULTERROR= 'Something went wrong';
const NULLCOMPONENTERROR= 'The component cannot be null';
const HISTORYTYPEERROR= 'The prop `history` has to be an instance of either HistoryAPI or NodeHistoryAPI';



/**
 * Route declaration component
 */
export class Route extends React.Component {
	render() { return null; }
}

Route.propTypes= {

	caseInsensitive: React.PropTypes.bool,

	statusCode: React.PropTypes.number,

	errorHandler: React.PropTypes.bool,

	controller: React.PropTypes.func,

	method: React.PropTypes.string,

	component: React.PropTypes.func.isRequired
};



/**
 * Routing wrapper for specifying router elements
 */
export class Router extends React.Component {

	constructor(props) {
		super(props);

		this.state= {
			currentUrl: '/'
		};

		this._routes= 
			this.props.children
				.filter(
					comp => 
						(comp.type === (<Route component={()=>null} />).type)
				)
				.map( val => val.props );

		if(!(this.props.history instanceof _HnRouteHistoryAPI))
			throw new Error(HISTORYTYPEERROR);
	}

	componentDidMount() {

		this.props.history
			.routeChangeListener((data)=> {

			this.setState({
				currentUrl: data.url
			});
		});
	}

	componentWillUnmount() {
		
		this.props.history.removeChangeListener();
	}

	render() {

		if(this.props.history.response && this.props.history.response.hasTerminated) {
			return null;
		}

		const route= this.props.history.matchRoute(this._routes);

		if(!route) {
			throw new Error(DEFAULTERROR);
		}

		if(!route.$component) {
			throw new Error(NULLCOMPONENTERROR);
		}


		// The default props
		let defaultProps= {
			routerProps: {
				url: this.state.currentUrl,
				location: this.props.history.location
			}
		};

		// Call the router controller
		if(route.controller) {
			route.controller(
				_props => {
					defaultProps= Object.assign(defaultProps, _props);
				}
			);
		}


		// Either render the route component or wrap it in a wrapper and render
		let $renderComponent= route.$component;

		if(typeof(this.props.wrapper) === 'function') {
			const Wrapper= this.props.wrapper;
			$renderComponent= <Wrapper>{route.$component}</Wrapper>;
		}

		return React.cloneElement(
			$renderComponent, 
			defaultProps
		);
	}
}

Router.propTypes= {

	wrapper: React.PropTypes.func,

	history: React.PropTypes.object.isRequired
};
