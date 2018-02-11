

import React from 'react';

import {expect} from 'chai';

import { renderComponent } from '../../lib/helper.jsx';

import { Resource, Action } from '../../middlewares/APIResourcesRouter.jsx';

import { mockCtx, createController } from '../../lib/testHelpers.jsx';


describe('API Resources Router', () => {

	describe('with simple handler function routing', () => {

		it('should call the correct action in the controller', () => {

			let handerFnWasCalled = false;
			const handlerFn = () => { handerFnWasCalled = true; };

			const ctx = mockCtx('/users', { method: 'get' });

			renderComponent(() =>
				<Resource {...ctx} name='users'>
					<Action path='/' method='GET' handler={handlerFn} />
					<Action path='/view' method='GET' handler={() => null} />
				</Resource>
			);

			expect(handerFnWasCalled).to.be.true;
		});


		it('should not match when method is incorrect', () => {

			let handerFnWasCalled = false;
			const handlerFn = () => { handerFnWasCalled = true; };

			const ctx = mockCtx('/users/add', { method: 'get' });

			renderComponent(() =>
				<Resource {...ctx} name='users'>
					<Action path='/' method='GET' handler={() => null} />
					<Action path='/add' method='POST' handler={handlerFn} />
				</Resource>
			);

			expect(handerFnWasCalled).to.be.false;
		});


		it('should call nothing when nothing matches', () => {

			let handerFnWasCalled = false;
			const handlerFn = () => { handerFnWasCalled = true; };

			const ctx = mockCtx('/uk09kse', { method: 'get' });

			renderComponent(() =>
				<Resource {...ctx} name='posts'>
					<Action path='/' method='GET' handler={handlerFn} />
					<Action path='/something-else' method='GET' handler={() => null} />
				</Resource>
			);

			expect(handerFnWasCalled).to.be.false;
		});
	});


	// Tests for controller that return a promise
	// describe('With controllers that return a Promise', () => {

	// });

});
