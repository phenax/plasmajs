
import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';


export function renderComponent(Element, props={}) {
	return renderToStaticMarkup(<Element {...props} />);
}


// Render react components(only server-side)
export function renderTemplate(Element, props) {

	const renderedContent= renderComponent(Element, props);

	if(renderedContent == null)
		return null;

	let html= '<!doctype html>';

	html+= renderedContent;

	return html;
}

// Route matching
export function checkUrlMatch(url, reqUrl, method1='GET', method2='GET') {

	let isAMatch = false;

	if(typeof url.test === 'function') {
		isAMatch = url.test(reqUrl);
	} else if(typeof url === 'string') {
		isAMatch = toUrlToken(url) === toUrlToken(reqUrl);
	}

	// Does the method name match?
	if(isAMatch && method1.toLowerCase() !== method2.toLowerCase())
		isAMatch = false;

	return isAMatch;
}


export const toUrlToken = url =>
	url.split('/').filter(f => f).join('.');

