import { MiddleWare } from '../MiddleWare';

import fs from 'fs';

import { createGzip, createDeflate } from 'zlib';

// Compressor middleware
export class Compressor extends MiddleWare {
  onRequest(req, res) {
    // let compressionType= null;
    // const acceptEncoding = req.headers['accept-encoding'] || '';
    // if (acceptEncoding.includes('gzip'))
    // 	compressionType= 'gzip';
    // else if (acceptEncoding.includes('deflate'))
    // 	compressionType= 'deflate';
    // if(compressionType) {
    // 	// res.writeHead(200, { 'Content-Encoding': compressionType });
    // 	const outer= (compressionType === 'gzip')? createGzip(): createDeflate();
    // 	res.pipe(outer)//.pipe(outStrem);
    // }
  }
}
