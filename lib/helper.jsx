
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function renderTemplate(Element, props={}) {

	const renderedContent= renderToStaticMarkup(<Element {...props} />);

	if(renderedContent == null)
		return null;

	let html= '<!doctype html>';

	html+= renderedContent;

	return html;
}

export function checkUrlMatch(url, reqUrl, method1='GET', method2='GET') {

	let isAMatch= false;

	if(typeof(url.test) === 'function') {

		isAMatch= url.test(reqUrl);

	} else if(typeof(url) === 'string') {

		isAMatch= url === reqUrl;

	}

	// Does the method name match?
	if(isAMatch) {
		if(method1.toLowerCase() !== method2.toLowerCase())
			isAMatch= false;
	}

	return isAMatch;
}
