
import {MiddleWare} from '../MiddleWare.jsx';

// Logger middleware
export class Logger extends MiddleWare {

	// All middlewares must implement the onRequest method
	onRequest(req, res) {

		// Color codes
		const AQUA= '\x1b[36m';
		const DEFAULT= '\x1b[0m';
		const DIM= '\x1b[2m';
		const RED= '\x1b[31m';

		const statusGroup= Math.floor(res.statusCode/100);
		const statusColor= (statusGroup != 2 && statusGroup != 3)? RED: AQUA;

		// if(this.props.time)
			// console.timeEnd(res.benchmarkNameSpace);

		if(this.props.color)
			console.log(statusColor, `[${res.statusCode}]`, DEFAULT, DIM, `${req.method}`, DEFAULT, `${req.url}`);
		else
			console.log(`[${res.statusCode}] ${req.method} ${req.url}`);
	}
}