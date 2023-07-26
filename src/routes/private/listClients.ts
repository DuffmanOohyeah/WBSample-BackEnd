'use strict';

export {};
const mongoUtils: any = require('../../utils/mongodb');

const get: any = async (req: any) => {
	let rtnObj: any[] = [];

	try {
		let dbName: string = 'wbsample_client_';
		let useWildcard: boolean = true;
		const result: any[] = await mongoUtils.getClient(dbName, useWildcard);
		rtnObj = result;
		req.statusCode = 200;
	} catch (err: any) {
		req.statusCode = 400;
	}

	return rtnObj;
};

module.exports = {
	get: get,
};
