
import {MiddleWare} from '../MiddleWare.jsx';

export class BlankMiddleWare extends MiddleWare {

	onRequest(req, res) {

		if(typeof this.props.handler === 'function')
			this.props.handler(req, res);
	}
}