import React from 'react';

import { MiddleWare } from '../MiddleWare.jsx';

import { checkUrlMatch } from '../lib/helper.jsx';


/**
 * Api resources structure
 *
 * 
 */
export class Resource extends MiddleWare {

	_controller = {};
	_actions = [];

	onRequest() {

		const Ctrlr = this.props.controller;
		const children = this.props.children;

		if(typeof Ctrlr === 'function') {
			this._controller = new Ctrlr();

			Object.getOwnPropertyNames(Ctrlr.prototype)
				.map(key => this._controller[key])
				.filter(action => typeof action === 'function')
				.filter(action => action.isAction)
				.forEach(action => {

					const { actionName, actionMethods } = action;
					const path = `/${resourceName}${actionName}`;

					this._actions.push({
						path,
						methods: actionMethods,
					});
				});
		}

		children
			.map(child => console.log(child));
	}
}


class Action extends React.Component {
	
}


/**
 *
 */
export const action =
	(method = null, path = null) =>
		(_, __, fnMeta) => {
			Object.assign(fnMeta.value, {
				isAction: true,
				actionName: (path !== null)? path: '/' + fnMeta.value.name,
				actionMethods:
					(Array.isArray(method)? method: [ method || 'get' ])
						.map(m => m.toLowerCase()),
			});
		};