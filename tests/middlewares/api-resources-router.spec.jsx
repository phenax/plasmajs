

import React from 'react';

import {expect} from 'chai';

import { renderComponent } from '../../lib/helper.jsx';

import { Resource, Action } from '../../middlewares/APIResourcesRouter.jsx';

import { mockCtx, createController } from '../../lib/testHelpers.jsx';


describe('API Resources Router', () => {

	describe('Resource class', () => {

		it('should call the correct action in the controller', () => {

			let handerFnWasCalled = false;
			const handlerFn = () => { handerFnWasCalled = true; console.log('---------------------------'); }

			const ctx = mockCtx('/posts', { method: 'post' });

			renderComponent(() =>
				<Resource {...ctx} name='posts'>
					<Action path='/' method='GET' handler={handlerFn} />
					<Action path='/something-else' method='GET' handler={() => null} />
				</Resource>
			);

			expect(handerFnWasCalled).to.be.true;
		});
	});


	// Tests for controller that return a promise
	// describe('With controllers that return a Promise', () => {

	// });

});
