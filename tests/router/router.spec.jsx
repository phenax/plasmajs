
import React from 'react';

import {expect} from 'chai';


import { Router, Route } from '../../router/server.jsx';
import { MockHistoryAPI } from '../../router/history/MockHistoryAPI.jsx';

import { renderComponent } from '../../lib/helper.jsx';
import * as route from '../../lib/testHelpers.jsx';

describe('Router', () => {

	let allRoutes;

	let currentUrl= '';

	const setUrl= url => currentUrl= url;

	const history= new MockHistoryAPI({}, {}, () => currentUrl);

	beforeEach(() => {

		// Create a router and routes
		allRoutes= props => (
			<Router history={history} wrapper={route.Wrapper}>

				<Route path='/' component={route.Index} />
				<Route path='/about' component={route.About} />

				<Route errorHandler={true} component={route.Error404} />
			</Router>
		);
	});

	describe('Configuration', () => {

		it('should be configured', () => {

		});
	});

	describe('Routing', () => {

		it('should render the right route for path as a string', () => {

			setUrl('/');

			const markup= renderComponent(allRoutes);

			// Rendered route should be the index route
			expect(markup).to.eql(route.indexString);
		});

		it('should render the right route for path as a regex', () => {
			
		});

		it('should render error route if no match was found', () => {

		});
	});
});
