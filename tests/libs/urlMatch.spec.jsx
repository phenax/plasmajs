
import {expect} from 'chai';

import { checkUrlMatch, toUrlToken } from '../../lib/helper.jsx';


describe('URL Matching', () => {


	it('should match two same urls as strings', () => {

		expect(checkUrlMatch('/', '/')).to.be.true;
		expect(checkUrlMatch('/wontwork', '/wont')).to.be.false;
	});


	it('should match a regex to the string', () => {

		expect(checkUrlMatch(/^\/hello$/, '/hello')).to.be.true;
		expect(checkUrlMatch(/^\/wontwork$/, '/wont')).to.be.false;
	});


	it('should match url and the method', () => {

		expect(checkUrlMatch('/hello', '/hello', 'GET', 'POST')).to.be.false;
		expect(checkUrlMatch(/^\/hello$/, '/hello', 'GET', 'POST')).to.be.false;
	});


	it('should tokenize url correctly', () => {

		expect(toUrlToken('/users/add')).to.be.eql('users.add');
		expect(toUrlToken('/us3clj be-rs/a-232wasd svdd')).to.be.eql('us3clj-be-rs.a-232wasd-svdd');
	});
});
