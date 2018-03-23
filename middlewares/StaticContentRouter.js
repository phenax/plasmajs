/* eslint-disable no-console */
import PropTypes from 'prop-types';
import fs from 'fs';
import path from 'path';

import includes from 'lodash/includes';

import { MiddleWare } from '../MiddleWare';

/**
 * Middleware to host static content on the server
 */
export class StaticContentRouter extends MiddleWare {
  static propTypes = {
    dir: PropTypes.string.isRequired,
    hasPrefix: PropTypes.bool,
    compress: PropTypes.bool,
  };

  /* eslint-disable no-unused-vars */
  onRequest(req, res) {
    // Defaults to a directory called static in the project root
    this.publicDir = this.props.dir || 'static';

    // Defaults to true because its faster
    this.hasPrefix = this.props.hasPrefix == null ? true : this.props.hasPrefix;

    // If the directory name if to be prefixed i.e.
    // ./public will be hosted as http://domain.com/public/file
    // instead of
    // http://domain.com/file
    if (this.hasPrefix) {
      const publicPathRegex = new RegExp(`^/${this.publicDir}/`);
      // If the url starts with /${publicDir}/
      if (publicPathRegex.test(req.url)) {
        this.sendFileContents();
      }
    } else {
      this.sendFileContents();
    }
  }
  /* eslint-enable no-unused-vars */

  getFileAbsolutePath(currentUrl) {
    // The base directory for the project i.e. root project directory
    const projectDir = path.resolve('.');

    // Read file and return string
    return this.hasPrefix
      ? // Has prefix i.e. static content url will be /${publicDir}/whatever
        path.resolve(projectDir, './' + currentUrl)
      : // No prefix i.e. static content url will be  /whatever
        path.resolve(projectDir, this.publicDir + '/' + currentUrl);
  }

  // Send the file contents to the server
  sendFileContents() {
    const STATIC_FILE_TIMER = 'Static file fetched';

    // For benchmarking
    console.time(STATIC_FILE_TIMER);

    // If the file wasnt found, stop here and let the router handler stuff
    const fileToFetch = this.getFileAbsolutePath(this.props.request.url);

    try {
      const fileStat = fs.statSync(fileToFetch);

      // Got the file we were looking for
      if (fileStat.isFile()) this.terminate();
      else return false;
    } catch (e) {
      return false;
    }

    // Stream the file
    this.props.response
      .sendFile(fileToFetch, {
        compress: this._supportedCompression.bind(this),
      })
      .then(() => console.timeEnd(STATIC_FILE_TIMER))
      .catch(e => console.error(e));

    return true;
  }

  _supportedCompression() {
    if (!this.props.compress) return false;
    const GZIP = 'gzip';
    const DEFL = 'deflate';
    let compressionType = false;
    const acceptEncoding = this.props.request.headers['accept-encoding'] || '';
    // Identify the compression supported
    if (includes(acceptEncoding, GZIP)) return GZIP;
    else if (includes(acceptEncoding, DEFL)) return DEFL;
    return compressionType;
  }
}
