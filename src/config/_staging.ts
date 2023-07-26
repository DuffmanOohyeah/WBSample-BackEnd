'use strict';

export {};

const appVars: any = {
	ports: [3000],
	sessionSecret: '???',
};

const mongoVars_AWS: any = {
	/* signed in with google acct preferences */
	dac_user: '???',
	dac_pwd: '???',
	dbName_tier1: 'wbsample_tier1',
	dbName_analytics: 'wbsample_web_analytics',
	host: 'localhost',
	port: 27017,
	protocol: 'mongodb://',
	connectOpts: {
		connectTimeoutMS: 10000,
		socketTimeoutMS: 20000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};

const mongoVars_AWS2: any = {
	dac_user: '???',
	dac_pwd: '???',
	dbName_tier1: 'wbsample_tier1',
	dbName_analytics: 'wbsample_web_analytics',
	protocol: 'mongodb://',
	host: 'localhost',
	connectOpts: {
		connectTimeoutMS: 10000,
		socketTimeoutMS: 20000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};

const mongoVars: any = {
	dac_user: '???',
	dac_pwd: '???',
	dbName_tier1: 'wbsample_tier1',
	dbName_analytics: 'wbsample_web_analytics',
	protocol: 'mongodb+srv://',
	host: 'cluster0.ixdkd.mongodb.net',
	connectOpts: {
		connectTimeoutMS: 10000,
		socketTimeoutMS: 20000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
}; // atlas

const getMongoUri: any = (db: string) => {
	// mongodb+srv://<username>:<password>@cluster0.egwv6.mongodb.net:1234/<dbname>?retryWrites=true&w=majority
	let rtn: string = exports.mongoVars.protocol;
	rtn += exports.mongoVars.dac_user + ':';
	rtn += exports.mongoVars.dac_pwd + '@';
	rtn += exports.mongoVars.iam_secret_access_key + '@';
	rtn += exports.mongoVars.host + '/';
	rtn += exports.getMongoDbName(db); // returns string
	rtn += '?retryWrites=true&w=majority'; // qs
	return rtn;
};

const getMongoDbName: any = (db: string) => {
	let rtn: string = '';
	switch (db) {
		case 'tier1':
			rtn = mongoVars.dbName_tier1;
			break;
		case 'analytics':
			rtn = mongoVars.dbName_analytics;
			break;
		default:
			rtn = db; // dynamic client db name
			break;
	}
	return rtn;
};

const redisVars: any = {
	dbName: 'wbsample-staging',
	host: 'redis-staging.32ptyh.ng.0001.euw1.cache.amazonaws.com',
	port: 6379,
	protocol: 'redis://',
	user_id: '???',
	user_pwd: '???',
};

const getRedisUri: any = () => {
	let rtn: string = exports.redisVars.protocol;
	rtn += exports.redisVars.user_id + ':';
	rtn += exports.redisVars.user_pwd + '@';
	rtn += exports.redisVars.host + ':';
	rtn += exports.redisVars.port;
	return rtn;
};

const awsVars: any = {
	userName: '???',
	pasword: '???',
	publicDns: 'ec2-3-250-162-94.eu-west-1.compute.amazonaws.com', // https://
};

const smtpVars: any = {
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '???',
		pass: '???',
	},
};

exports = module.exports = {
	appVars: appVars,
	mongoVars: mongoVars,
	redisVars: redisVars,
	getRedisUri: getRedisUri,
	awsVars: awsVars,
	getMongoUri: getMongoUri,
	getMongoDbName: getMongoDbName,
	smtpVars: smtpVars,
};
