
import React from 'react';

import {expect} from 'chai';

import { renderComponent } from '../../lib/helper.jsx';
import { APIRoute } from '../../middlewares/APIRouter.jsx';

import { mockCtx } from '../../lib/testHelpers.jsx';

describe('APIRoute', () => {

	let component;
	let ctx;

	beforeEach(() => {

		ctx= mockCtx('/api/test');

		component= 
			ctrlr => props => 
				<APIRoute {...ctx} path='/api/test' controller={ctrlr} />;
	});

	it('should call controller when route is triggered', () => {

		const controller= _ => { controller.hasBeenCalled= true; }
		controller.hasBeenCalled= false;

		renderComponent(component(controller));

		expect(controller.hasBeenCalled).to.be.true;
	});


	it('should render json', () => {

		const data= { a: 'b' };
		const controller= send => send(data);

		renderComponent(component(controller));

		expect(ctx.calledFn).to.eql('response.json');

		expect(ctx.calledWith).to.eql(data);
	});


	describe('controller that returns a Promise', () => {

		const data= { a: 'b' };

		let callback= () => {};
		
		beforeEach((done) => {
			
			const controller= () => {

				return new Promise((resolve, reject) => {
					setTimeout(() => resolve(data), 500);
				})
				.catch( e => console.error(e) )
				.then( data => {
					done();
					return data;
				});
			};

			renderComponent(component(controller));
		});

		it('should render json resolved by the promise', () => {

			// Slightly hacky but no way to execute a function at the end
			// of the promise chain
			setTimeout(() => {
				expect(ctx.calledFn).to.eql('response.json');
				expect(ctx.calledWith).to.eql(data);
			}, 0);
		});
	});

});