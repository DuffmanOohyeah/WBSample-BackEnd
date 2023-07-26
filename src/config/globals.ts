'use strict';

export {};
const mongoUtils: any = require('../utils/mongodb');
const mongo: any = require('mongodb');
//const config: any = require('./index').data;

/* start: get outside vars - should be js var'd on client rendered website */
//let clientId: string = (__clientId || '');
//let eventId: string = (__eventId || '');
/* end: get outside vars - should be js var'd on client rendered website */

const get: any = async (app: any) => {
	try {
		const keys: string[] = [
			'app_name',
			'chat_name',
			'wbsample_company_name',
			'wbsample_from_email',
		];

		if (!app.get(keys[0])) {
			// if undefined
			const client: any = await mongoUtils.connect('tier1');
			const db: any = await mongoUtils.getDb(client);
			const collection1: any = await db.collection('settings');
			const all: any[] = await collection1
				.find({ setting: { $in: keys } })
				.toArray();

			/*if( clientId.length == 24 ){
        const o_id: any = new mongo.ObjectID(clientId);
        const collection2: any = await db.collection('clients');
        const clientInfo: any = await collection2.find({ _id: o_id });
        console.log('clientInfo:', clientInfo);
        // if(  ) app.set('cli', '');        
      }*/

			await mongoUtils.close(client);

			all.forEach((obj: any) => {
				app.set(obj.setting, obj.value);
			});
		}
	} catch (err: any) {
		console.log('globals err:', err.message);
	}
	return null;
};

module.exports = {
	get: get,
};
