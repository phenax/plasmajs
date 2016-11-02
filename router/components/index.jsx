
import React from 'react';

import { triggerUpdate, routerConfig } from '../history/events.jsx';


/**
 * Link component to be used as an anchor tag for front-end routing
 */
export class Link extends React.Component {

	_shouldTriggerUpdate() {

		// IF the href is set, dont do shit
		if(this.props.href)
			return false;

		// IF to is not set, dont do shit
		if(!this.props.to)
			return false;

		return true;
	}

	_visitLink(e) {

		if(!this._shouldTriggerUpdate())
			return;	

		e.preventDefault();

		// If its hash based url, change hash
		if(routerConfig.type === 'hash') {
			window.location.hash= `#${this.props.to}`;
			return;
		}

		const defaultState= {
			path: this.props.to
		};

		window.history.pushState(
			(this.props.state)? { ...defaultState, ...this.props.state }: { ...defaultState }, 
			'', this.props.to
		);

		triggerUpdate();
	}

	render() {

		const properties= {};

		for(let key in this.props) {

			if(
				key === 'to' ||
				key === 'children'
			)
				continue;

			properties[key]= this.props[key];
		}

		return (
			<a
				href={this.props.to || this.props.href} 
				onClick={this._visitLink.bind(this)}
				{...properties} >

				{this.props.children}
			</a>
		);
	}
}

Link.propTypes= {
	to: React.PropTypes.string,
	href: React.PropTypes.string,
	state: React.PropTypes.object
};
