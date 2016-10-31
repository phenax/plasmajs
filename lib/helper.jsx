
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

export function checkUrlMatch(url, reqUrl) {

	if(typeof(url.test) === 'function') {

		return url.test(reqUrl);

	} else if(typeof(url) === 'string') {

		return url === reqUrl;

	}

	return false;
}
