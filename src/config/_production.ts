'use strict';

export {};

const appVars: any = {
	ports: [80, 443],
	sessionSecret: '???',
};

const mongoVars: any = {
	/* signed in with google acct preferences */
	dac_user: '???',
	dac_pwd: '???',
	dbName_tier1: 'wbsample_tier1',
	dbName_analytics: 'wbsample_web_analytics',
	cluster: 'cluster0',
	connectOpts: {
		connectTimeoutMS: 10000,
		socketTimeoutMS: 20000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};

const getMongoUri: any = (db: string) => {
	// mongodb+srv://<username>:<password>@cluster0.egwv6.mongodb.net/<dbname>?retryWrites=true&w=majority
	let rtn: string = 'mongodb+srv://'; // protocol
	rtn += mongoVars.dac_user + ':'; // user
	rtn += mongoVars.dac_pwd + '@'; // pass
	rtn += mongoVars.cluster + '.egwv6.mongodb.net/'; // web address
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
	dbName: 'wbsample-production',
	host: '???',
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
	publicDns: 'ec2-3-250-162-94.eu-west-1.compute.amazonaws.com',
};

const smtpVars: any = {
	host: '???',
	port: 0,
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
