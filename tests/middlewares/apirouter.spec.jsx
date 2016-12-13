
import React from 'react';

import {expect} from 'chai';

import { renderComponent } from '../../lib/helper.jsx';
import { APIRoute } from '../../middlewares/APIRouter.jsx';

import { mockCtx } from '../../lib/testHelpers.jsx';


describe('APIRoute', () => {

	let ctx;

	// API Route component creator
	const component= 
			ctrlr => props => 
				<APIRoute {...ctx} path='/api/test' controller={ctrlr} />;

	beforeEach(() => {

		// Create a new context for /api/test
		ctx= mockCtx('/api/test');
	});

	// Test to check whether the controller for the api route was called
	it('should call controller when route is triggered', () => {

		const controller= _ => { controller.hasBeenCalled= true; }
		controller.hasBeenCalled= false;

		renderComponent(component(controller));

		expect(controller.hasBeenCalled).to.be.true;
	});

	// Test to check whether the apiroute renders json data
	it('should render json', () => {

		const data= { a: 'b' };
		const controller= send => send(data);

		renderComponent(component(controller));

		// The middleware should make a call to response.json
		expect(ctx.calledFn).to.eql('response.json');

		// response.json should be called with the data
		expect(ctx.calledWith).to.eql(data);

		// The statusCode of the response should be 200
		expect(ctx.calledTarget.statusCode).to.eql(200);
	});


	it('should give an error if the controller sends an error', () => {

		const err= new Error('Some error');
		err.statusCode= 503;

		// Call the error method
		const controller= (send, error) => error(err);

		renderComponent(component(controller));

		// Should be a 500 server error
		expect(ctx.calledTarget.statusCode).to.eql(503);

		// Should send the error as json
		expect(ctx.calledFn).to.eql('response.json');
		expect(ctx.calledWith).to.eql(err);
	});


	// Tests for controller that return a promise
	describe('controller that returns a Promise', () => {

		const data= { a: 'b' };

		beforeEach((done) => {
			
			const controller= () => {

				return new Promise((resolve, reject) => {
					setTimeout(() => resolve(data), 50);   // A 50ms delay but thats slow enough
				})
				.catch( e => console.error(e) )
				.then( data => {
					done();
					return data;
				});
			};

			// Render the component
			renderComponent(component(controller));
		});

		it('should render json resolved by the promise', (done) => {

			// Slightly hacky but no way to execute a function at the end
			// of the promise chain
			process.nextTick(() => {

				expect(ctx.calledFn).to.eql('response.json');
				expect(ctx.calledWith).to.eql(data);

				expect(ctx.calledTarget.statusCode).to.eql(200);

				done();
			});
		});

		// it('should give a')
	});

});