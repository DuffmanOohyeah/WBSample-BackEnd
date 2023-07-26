'use strict';

export {};
const mongoUtils: any = require('./mongodb');
const config: any = require('../config/index').data;

const doSetup: any = async (req: any) => {
	const rtnObj: any = {};
	try {
		let dbName: string = 'analytics';
		const client: any = await mongoUtils.connect(dbName);
		const db: any = await mongoUtils.getDb(client, dbName);
		const collection: any = await db.collection('tracking');
		let popTracking: boolean = await exports.populateTracking(collection, req);
		await mongoUtils.close(client);
		rtnObj['tracking_populated'] = popTracking;
		req.statusCode = 200;
	} catch (err: any) {
		rtnObj.err = err.message;
		req.statusCode = 400;
	}
	return rtnObj;
};

const populateTracking: any = async (collection: any, req: any) => {
	let rtnBln: boolean = false;
	try {
		const arr: any[] = await collection.find({}).toArray();
		if (!arr.length) {
			const insert: any = await collection.insertOne({
				client_id: '',
				event_id: '',
				user_id: '',
				action_name: 'Dummy action',
				start_date: new Date(),
				end_date: new Date(),
				remote_addr:
					req.get('x-forwarded-for') || req.connection.remoteAddress || '',
				protocol: req.protocol || '',
				host: req.get('host') || '',
				original_url: req.originalUrl || '',
				user_agent: req.get('user-agent') || '',
			});
			if (insert.result && insert.result.ok) {
				rtnBln = true;
			}
		}
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return rtnBln;
};

exports = module.exports = {
	doSetup: doSetup,
	populateTracking: populateTracking,
};
