
import React from 'react';
import { Router, Route } from '../router/server.jsx';
import { MockHistoryAPI } from '../router/history/MockHistoryAPI.jsx';

export const Wrapper= props => <div>{props.children}</div>;

export const Index=     props => <div>Index</div>;
export const About=     props => <div>About</div>;
export const Error404=  props => <div>Error</div>;



export const getRouter= url => props => (
	<Router history={new MockHistoryAPI({}, {}, url)} wrapper={Wrapper}>

		<Route path='/' component={Index} />
		<Route path={/^\/about$/} component={About} />

		<Route errorHandler={true} component={Error404} />
	</Router>
);


export const indexString= '<div><div>Index</div></div>';
export const aboutString= '<div><div>About</div></div>';
export const errorString= '<div><div>Error</div></div>';

