
import React from 'react';

import {expect} from 'chai';


import { Route } from '../../router/server.jsx';
import { MockHistoryAPI } from '../../router/history/MockHistoryAPI.jsx';

import { renderComponent } from '../../lib/helper.jsx';
import * as route from '../../lib/testHelpers.jsx';


describe('Router', () => {

	describe('Configuration', () => {

		let router;

		beforeEach(() => {
			router= route.getRouter('/')();
		});

		it('should have the history api', () => {

			expect(router.props.history).to.exist;
			expect(router.props.history).to.be.instanceof(MockHistoryAPI);
		});

		it('should have all routes', () => {

			expect(router.props.children).to.not.be.empty;

			router.props.children
				.forEach( child => {

					expect(child).to.exist;

					expect(child.type).to.eql((<Route component={() => {}} />).type);
				});

			expect(router.props.history).to.be.instanceof(MockHistoryAPI);
		});
	});



	describe('Routing', () => {

		it('should render match for path as a string', () => {

			const markup= renderComponent(route.getRouter('/'));

			// Rendered route should be the index route
			expect(markup).to.eql(route.indexString);
		});


		it('should render match for path as a regex', () => {

			const markup= renderComponent(route.getRouter('/about'));

			// Rendered route should be the about route
			expect(markup).to.eql(route.aboutString);
		});


		it('should render error route if no match was found', () => {

			const markup= renderComponent(route.getRouter('/this-route-doesnt-exist-404-error'));

			// Rendered route should be the 404 error
			expect(markup).to.eql(route.errorString);
		});
	});
});
