
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

		const controller= send => send({ a: 'b' });

		renderComponent(component(controller));

		expect(ctx.calledFn).to.eql('response.json');
	});


	it('should resolve promise returned from the controller', () => {

		
	});

});