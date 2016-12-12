
import React from 'react';

import { Router, Route } from '../../router/server.jsx';
import { MockHistoryAPI } from '../../router/history/MockHistoryAPI.jsx';

describe('Router', () => {

	let allRoutes;

	let currentUrl= '';

	const history= new MockHistoryAPI({}, {}, () => currentUrl);

	const Wrapper= props => <div>{props.children}</div/>;
	const Index= props => <div>Index</div/>;
	const About= props => <div>About</div/>;


	beforeEach(() => {

		// Create a router and routes
		allRoutes= (
			<Router history={history} wrapper={wrapper}>

				<Route path='/' component={Index} />
				<Route path='/about' component={About} />

				<Route errorHandler={true} component={() => <div>Error</div>} />
			</Router>
		);
	});


	describe('Configuration', () => {

		it('should be configured', () => {

		});
	});

	describe('Routing', () => {

		it('should render the right route for path as a string', () => {
			
		});

		it('should render the right route for path as a regex', () => {
			
		});

		it('should render error route if no match was found', () => {

		});
	});
});
