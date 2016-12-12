
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

	beforeEach(() => {

		// Create a router and routes
		allRoutes= url => props => (
			<Router history={new MockHistoryAPI({}, {}, url)} wrapper={route.Wrapper}>

				<Route path='/' component={route.Index} />
				<Route path={/^\/about$/} component={route.About} />

				<Route errorHandler={true} component={route.Error404} />
			</Router>
		);
	});

	describe('Configuration', () => {

		it('should be configured', () => {

			const router= allRoutes('/')();

			
		});
	});



	describe('Routing', () => {

		it('should render the right route for path as a string', () => {

			const markup= renderComponent(allRoutes('/'));

			// Rendered route should be the index route
			expect(markup).to.eql(route.indexString);
		});


		it('should render the right route for path as a regex', () => {

			const markup= renderComponent(allRoutes('/about'));

			// Rendered route should be the about route
			expect(markup).to.eql(route.aboutString);
		});


		it('should render error route if no match was found', () => {

			const markup= renderComponent(allRoutes('/this-route-doesnt-exist-404-error'));

			// Rendered route should be the 404 error
			expect(markup).to.eql(route.errorString);
		});
	});
});
