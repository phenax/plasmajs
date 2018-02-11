import React from 'react';

import { MiddleWare } from '../MiddleWare.jsx';

import { checkUrlMatch } from '../lib/helper.jsx';


/**
 * Api resources structure
 *
 * 
 */
export class Resource extends MiddleWare {

	toUrl(path) { return `/${this.props.name}${path}` }

	onRequest() {
		this._controller = {};
		this._actions = [];

		const Ctrlr = this.props.controller;

		this.props.children.forEach(child => {

			const action = {
				url: this.toUrl(child.props.path),
				methods: [ child.props.method.toLowerCase() ],
				handler: child.props.handler,
			};

			if(typeof action.handler === 'string') {
				action.handler = Ctrlr[action.handler];
			}

			this._actions.push(action);
		});

		// if(typeof Ctrlr === 'function') {
		// 	this._controller = new Ctrlr();
		//
		// 	Object.getOwnPropertyNames(Ctrlr.prototype)
		// 		.map(key => this._controller[key])
		// 		.filter(action => typeof action === 'function')
		// 		.filter(action => action.isAction)
		// 		.forEach(action => {
		//
		// 			const { actionName, actionMethods } = action;
		// 			const path = `/${this.props.name}${actionName}`;
		//
		// 			this._actions.push({
		// 				path,
		// 				methods: actionMethods,
		// 			});
		// 		});
		// }


		this._executeMatchingAction();
	}

	_executeMatchingAction() {

		for(let i = 0; i < this._actions.length; i++) {

			const action = this._actions[i];

			for(let j = 0; j < action.methods.length; j++) {

				const isAMatch = checkUrlMatch(
					action.url, this.props.request.url,
					this.props.request.method, action.methods[j]
				);

				if(isAMatch) {
					this.terminate();

					this.props.response.statusCode = 200;

					const promise = action.handler(this.props.request, this.props.response);

					if(promise instanceof Promise) {
						promise
							.then(this.emitResponse)
							.catch(this.emitError);
					}
					return;
				}
			}
		}
	}

	emitResponse(data) {
		this.props.response.json(data || {})
	}

	emitError(e) {
		this.props.response.statusCode = e.statusCode || 500;
		this.props.response.json(e || {});
	}
}


export class Action extends React.Component {
	
	render() {
		return null;
	}
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