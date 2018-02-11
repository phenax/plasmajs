

import React from 'react';

import {expect} from 'chai';

import { renderComponent } from '../../lib/helper.jsx';
import { Resource } from '../../middlewares/APIResourcesRouter.jsx';

import { mockCtx, PostsTestController } from '../../lib/testHelpers.jsx';


describe('API Resources Router', () => {

	describe('Resource class', () => {

		// 
		it('should ', () => {

			const ctx = mockCtx('/posts/add', { method: 'post' });

			renderComponent(
				<Resource {...ctx} name='posts' controller={PostsTestController} />
			);

			expect(controller.hasBeenCalled).to.be.true;
		});
	});


	// Tests for controller that return a promise
	describe('With controllers that return a Promise', () => {

	});

});
