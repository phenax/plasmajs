
import React from 'react';
import { Router, Route } from '../router/server.jsx';
import { MockHistoryAPI } from '../router/history/MockHistoryAPI.jsx';


// Dummy components
export const Wrapper= props => <div>{props.children}{props.name}</div>;

export const Index=     props => <div>Index</div>;
export const About=     props => <div>About</div>;
export const Error404=  props => <div>Error</div>;

export const CtrlrPage= props => null;


// Mock router component creator
export const getRouter= (url, ctrlr=(()=>{})) => props => (
	<Router history={new MockHistoryAPI({}, {}, url)} wrapper={Wrapper}>

		<Route path='/' component={Index} />
		<Route path={/^\/about$/} component={About} />

		<Route path='/ctrlr' component={CtrlrPage} controller={ctrlr} />

		<Route errorHandler={true} component={Error404} />
	</Router>
);

// Expected rendered strings for each routes
export const indexString= '<div><div>Index</div></div>';
export const aboutString= '<div><div>About</div></div>';
export const errorString= '<div><div>Error</div></div>';

// Controller output depends on the name passed in so...
export const getCtrlrString= name => `<div>${name}</div>`;


// Mock context object creator for the http request and response objects
export const mockCtx= (url) => {

	const ctx= {
		calledFn: null,
		calledTarget: null,
		calledWith: null,

		request: { url },

		response: new Proxy({}, {

			get: (target, field) => {

				ctx.calledTarget= target;

				ctx.calledFn= `response.${field}`;

				return (data) => {
					ctx.calledWith= data;
				};
			}
		})
	};

	return ctx;
};
