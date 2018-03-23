import React from 'react';

import compact from 'lodash/compact';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import join from 'lodash/join';
import split from 'lodash/split';
import toLower from 'lodash/toLower';

import { renderToStaticMarkup } from 'react-dom/server';

export function renderComponent(Element, props = {}) {
  return renderToStaticMarkup(<Element {...props} />);
}

// Render react components(only server-side)
export function renderTemplate(Element, props) {
  const renderedContent = renderComponent(Element, props);

  if (isNil(renderedContent)) return null;

  return `<!doctype html>${renderedContent}`;
}

// Route matching
export function checkUrlMatch(url, reqUrl, method1 = 'GET', method2 = 'GET') {
  let isAMatch = false;

  if (isFunction(url.test)) {
    isAMatch = url.test(reqUrl);
  } else if (isString(url)) {
    isAMatch = toUrlToken(url) === toUrlToken(reqUrl);
  }

  // Does the method name match?
  if (isAMatch && toLower(method1) !== toLower(method2)) return false;
  return isAMatch;
}

export const trimAndReplaceChar = (str, char, replacementChar) =>
  join(compact(split(str, char)), replacementChar);
export const toUrlToken = url =>
  trimAndReplaceChar(trimAndReplaceChar(url, '/', '.'), ' ', '-');
