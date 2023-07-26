'use strict';

export {};
const mongoUtils: any = require('../../utils/mongodb');
const mongo: any = require('mongodb');

const get: any = async (req: any) => {
	const rtnObj: any = {};
	try {
		let userId: string = (req.params.userId || '').trim();

		if (userId.length == 24) {
			const o_id: any = new mongo.ObjectID(userId);
			const client: any = await mongoUtils.connect('tier1');
			const db: any = await mongoUtils.getDb(client);
			const collection: any = await db.collection('users');
			const result: any = await collection.updateOne(
				{ _id: o_id },
				{ $set: { email_validated: true } }
			);
			await mongoUtils.close(client);

			if (result.modifiedCount) {
				rtnObj.data = 'Your account has been confirmed; thank you.';
			} else {
				rtnObj.data = 'Your account could not be confirmed.';
			}
		} else {
			rtnObj.data = 'The user id provided is not valid.';
		}

		req.statusCode = 200;
	} catch (err: any) {
		rtnObj.err = err.message;
		req.statusCode = 400;
	}
	return rtnObj;
};

module.exports = {
	get: get,
};
