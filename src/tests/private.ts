'use strict';

export {};

const config: any = require('../config/index').data;
const chai: any = require('chai');
const chaiHttp: any = require('chai-http');
const expect: any = chai.expect;
const should: any = chai.should();
const sinon: any = require('sinon');
let requestUrl: string = 'http://localhost:' + config.appVars.ports[0];

chai.use(chaiHttp);

describe('#GET /cms', function () {
	it('it should return 200 status with a valid json response', function (done) {
		chai
			.request(requestUrl)
			.get('/cms')
			.end((err: any, res: any) => {
				if (err) {
					console.log('err:', err.message);
				}
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('zone');
			});
		done();
	});
});

describe('#POST /cms/login', function () {
	before(function () {
		// runs once before the first test in this block
	});

	after(function () {
		// runs once after the last test in this block
	});

	beforeEach(function () {
		// runs before each test in this block
		this.server = sinon.fakeServer.create();
	});

	afterEach(function () {
		// runs after each test in this block
		this.server.restore();
	});

	it('it should return 200 status with a valid json response', function (done) {
		const formData: any = {
			email: 'fred@flintstone.com',
			password: 'yabbadabbadoo',
		};

		chai
			.request(requestUrl)
			.post('/cms/login')
			.type('form')
			.send(formData)
			.end((err: any, res: any) => {
				if (err) {
					console.log('err:', err.message);
				}
				res.should.have.status(200);
				res.body.should.be.a('object');
				//res.body.should.have.property('zone');
			});

		done();
	});
});
