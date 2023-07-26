'use strict';

export {};

const config: any = require('../config/index').data;
const chai: any = require('chai');
const chaiHttp: any = require('chai-http');
//const expect: any = chai.expect;
const should: any = chai.should();
const sinon: any = require('sinon');
let requestUrl: string = 'http://localhost:' + config.appVars.ports[0];

chai.use(chaiHttp);

describe('#GET /', function () {
	before(function () {
		// runs once before the first test in this block
	});

	after(function () {
		// runs once after the last test in this block
	});

	beforeEach(function () {
		// runs before each test in this block
	});

	afterEach(function () {
		// runs after each test in this block
	});

	it('it should return 200 status with a valid json response', function () {
		chai
			.request(requestUrl)
			.get('/')
			.end((err: any, res: any) => {
				if (err) {
					console.log('err:', err.message);
				}
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('zone');
			});
	});
});
