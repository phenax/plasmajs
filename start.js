// const path= require('path');

// const defConf= {
// 	presets: [ 'es2015', 'react' ],
// 	plugins: [ 'transform-object-rest-spread' ]
// };

// require('babel-register')();

// module.exports= ()=> {

// 	const { NodeServer }= require('./app.jsx');

// 	const fileName= '.';

// 	let App;

// 	try {
// 		App= require(path.resolve(fileName)).default;
// 	} catch(e) {
// 		console.log("Module not found ", e);
// 		process.exit(1);
// 	}

// 	const Server= App.NodeServer || NodeServer;

// 	const server= new Server(App);

// 	server.createServer();
// 	server.start();
// };


