'use script';

export {};
const mongodb: any = require('mongodb');
const MongoClient: any = mongodb.MongoClient;
const Server = require('mongodb').Server;
//const config: any = require('../config/index').data;

const connect: any = async (dbName: string) => {
	let rtnObj: any = {};
	try {
		rtnObj = await MongoClient.connect(new Server('localhost', 27017), {
			native_parser: true,
		});
		console.log('-> Mongo connect successful.');
	} catch (err) {
		console.error('-> Mongo connect err:', err);
	}
	return rtnObj;
};

const close: any = async (client: any) => {
	let rtnBln: boolean = false;
	try {
		//console.log('isConnected:', client.isConnected());
		if (client.isConnected()) {
			await client.close();
		}
		rtnBln = true;
		//console.log('-> Mongo close successful.');
	} catch (err) {
		console.error('-> Mongo close err:', err);
	}
	return rtnBln;
};

/* start: define getters */
const getDb: any = async (client: any, collection: string) => {
	let rtnObj: any = {};
	try {
		// rtnObj = await client.db(config.getMongoDbName(collection));
		rtnObj = await client.db('tier1');
		//console.log('-> Mongo get db successful.');
	} catch (err) {
		console.error('-> Mongo get db err:', err);
	}
	return rtnObj;
};

const getClient: any = async (dbName: string, useWildcard: boolean = false) => {
	let rtnObj: any[] = [];
	try {
		dbName = dbName.trim();
		const client: any = await exports.connect('tier1');
		const db: any = await exports.getDb(client, 'tier1');
		const collection: any = await db.collection('clients');
		if (useWildcard) {
			rtnObj = await collection
				.find({ clientdb_instance: { $regex: '.*' + dbName + '.*' } })
				.sort({ friendly_name: 1, join_date: -1 })
				.toArray();
		} else {
			rtnObj = await collection
				.find({ clientdb_instance: dbName })
				.limit(1)
				.toArray();
		}
		await exports.close(client);
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return rtnObj;
};

const getCountry: any = async (isoCode: string) => {
	let rtnObj: any = {};
	try {
		const client: any = await exports.connect('tier1');
		const db: any = await exports.getDb(client, 'tier1');
		const collection: any = await db.collection('countries');
		const result: any[] = await collection
			.find({ iso_code: isoCode.trim() })
			.limit(1)
			.toArray();
		await exports.close(client);
		if (result.length) {
			rtnObj = result[0];
		}
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return rtnObj;
};

const getTitle: any = async (title: string) => {
	let rtnObj: any = {};
	try {
		const client: any = await exports.connect('tier1');
		const db: any = await exports.getDb(client, 'tier1');
		const collection: any = await db.collection('titles');
		const result: any[] = await collection
			.find({ title: title.trim() })
			.limit(1)
			.toArray();
		await exports.close(client);
		if (result.length) {
			rtnObj = result[0];
		}
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return rtnObj;
};

const getRole: any = async (role: string) => {
	let rtnObj: any = {};
	try {
		const client: any = await exports.connect('tier1');
		const db: any = await exports.getDb(client, 'tier1');
		const collection: any = await db.collection('roles');
		const result: any[] = await collection
			.find({ role: role.trim() })
			.limit(1)
			.toArray();
		await exports.close(client);
		if (result.length) {
			rtnObj = result[0];
		}
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return rtnObj;
};

const getUser: any = async (email: string) => {
	let rtnObj: any = {};
	try {
		let dbAlias: string = 'tier1';
		const client: any = await exports.connect(dbAlias);
		const db: any = await exports.getDb(client, dbAlias);
		const collection: any = await db.collection('users');
		const result: any[] = await collection
			.find({ email: email.trim() })
			.limit(1)
			.toArray();
		await exports.close(client);
		//console.log('result:', result);
		if (result.length) {
			rtnObj = result[0];
		}
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return rtnObj;
};
/* end: define getters */

/* start: define setters */
const setClient: any = async (args: any) => {
	let clientId: string = '';
	try {
		const client: any = await exports.connect('tier1');
		const db: any = await exports.getDb(client, 'tier1');
		const collection: any = await db.collection('clients');

		if (args.clientDb && args.clientDb.trim().length) {
			const insert: any = await collection.insertOne({
				full_name: args.fullName || '',
				friendly_name: args.friendlyName || '',
				clientdb_instance: args.clientDb,
				address: args.address || '',
				city: args.city || '',
				county: args.county || '',
				country: args.country || '',
				logo: args.logo || '',
				join_date: args.joinDate || new Date(),
				archived: args.archived || false,
				archived_date: args.archivedDate || '',
				primary_contact: args.primaryContact || '',
				contact_email: args.contactEmail || '',
				contact_phone: args.contactPhone || '',
				account_manager: args.acctMgr || '',
			});

			if (insert.insertedId) {
				clientId = insert.insertedId;
			}
		}

		await exports.close(client);
	} catch (err: any) {
		console.log('err:', err.message);
	}
	return clientId;
};
/* end: define setters */

exports = module.exports = {
	connect: connect,
	close: close,
	getDb: getDb,
	getClient: getClient,
	getCountry: getCountry,
	getTitle: getTitle,
	getRole: getRole,
	getUser: getUser,
	setClient: setClient,
};
