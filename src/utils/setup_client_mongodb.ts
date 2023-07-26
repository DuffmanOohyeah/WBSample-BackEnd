'use strict';

export{};
const mongoUtils: any = require('./mongodb');
const { v4: uuidv4 }: any = require('uuid');


const doSetup: any = async (req: any, res: any) => {
  const rtnObj: any = {};
  try{
    req.body.dbName = req.body.dbName.trim();

    let newDbName: string = req.body.dbName.toLowerCase();
        newDbName = newDbName.replace(/-/g, '_'); // lose the hyphens
        newDbName = newDbName.replace(/\s/g, '_');  // lose the spaces
        newDbName = newDbName.replace(/'/g, '');  // lose the single quotes
        newDbName = newDbName.replace(/"/g, '');  // lose the double quotes
    let dbPrefix: string = 'wbsample_client_';
    let dbSuffix: string = uuidv4();
    let dbInstance: string = dbPrefix + newDbName + '_' + dbSuffix;
    dbInstance = dbInstance.substr(0, 38); // mongo holds max 38 bytes for db name

    /* start: qry tier1 for db instance */
    const getClients: any = await mongoUtils.getClient(dbPrefix + newDbName + '_', true);  // returns array
    req.clientId = '';  // set default
    /* end: qry tier1 for db instance */

    switch( getClients.length ){
      case 0:
        /* start: create new client */
        req.clientId = await mongoUtils.setClient({
          fullName: req.body.dbName,
          friendlyName: req.body.dbName,
          clientDb: dbInstance
        }); // returns string
        /* end: create new client */
      break;
      case 1:
        req.clientId = getClients[0]._id; // get id from above query
        dbInstance = getClients[0].clientdb_instance; // overwrite manufactured default
      break;
      default:  // multiple records to parse
        // TODO: need to decide on which client instance to use
        for( let obj of getClients ){
          if( obj.clientdb_instance === dbInstance ){
            req.clientId = obj._id;
            dbInstance = obj.clientdb_instance; // overwrite manufactured default
            break;
          }
        };
      break;
    }

    const client: any = await mongoUtils.connect(dbInstance);
    const db: any = await mongoUtils.getDb(client, dbInstance);
      let popEvents: boolean = await exports.populateEvents(req, db);
      let popSessons: boolean = await exports.populateSessions(db);
      let popPresenters: boolean = await exports.populatePresenters(db);
      let popHalls: boolean = await exports.populateHalls(db);
      let popStages: boolean = await exports.populateStages(db);
      let popTables: boolean = await exports.populateTables(db);
    await mongoUtils.close(client);

    rtnObj['events_populated'] = popEvents;
    rtnObj['sessions_populated'] = popSessons;
    rtnObj['presenters_populated'] = popPresenters;
    rtnObj['halls_populated'] = popHalls;
    rtnObj['stages_populated'] = popStages;
    rtnObj['tables_populated'] = popTables;

    req.statusCode = 200;
  }catch( err: any ){
    rtnObj.err = err.message;
    req.statusCode = 400;
  }
  return rtnObj;
};


const populateEvents: any = async (req: any, db: any) => {
  let rtnBln: boolean = false;
  try{

    const collection: any = await db.collection('events');
    const arr: any[] = await collection.find({}).toArray();

    if( /*req.clientId.length &&*/ !arr.length ){
      let isoCode: string = (req.body.isoCode || 'GB');
      const countryObj: any = await mongoUtils.getCountry(isoCode);

      const insert: any = await collection.insertOne({
        client_id: (req.clientId || ''),
        event_name: (req.body.eventName || 'Dummy Event'),
        start_date: (req.body.startDate || ''),
        end_date: (req.body.endDate || (req.body.eventName ? '' : new Date())),
        primary_domain: (req.body.primaryDomain || ''),
        other_domains: [],
        address: (req.body.eventAddress || 'Dummy Address'),
        city: (req.body.eventCity || 'Dummy City'),
        county: (req.body.eventCounty || 'Dummy County'),
        country: (countryObj._id || ''),
        archived: (req.body.eventName ? false : true),
        archived_date: (req.body.eventName ? '' : new Date()),
        session_ids: []
      });
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }

  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateSessions: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('sessions');
    const arr: any[] = await collection.find({}).toArray();

    if( !arr.length ){
      const insert: any = await collection.insertOne({
        sesion_name: 'Dummy Session',
        start_date: '',
        end_date: new Date(),
        hall_id: '',
        stage_id: '',
        presenter_ids: []
      });

      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }

  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populatePresenters: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('presenters');
    const arr: any[] = await collection.find({}).toArray();

    if( !arr.length ){
      const title: any = await mongoUtils.getTitle('Dr.');
      const insert: any = await collection.insertOne({
        title_id: (title._id || ''),
        first_name: 'Dummy',
        last_name: 'Presenter',
        email: '',
        company: '',
        profile_img: '',
        social_media: []
      });

      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }

  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateHalls: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('halls');
    const arr: any[] = await collection.find({}).toArray();

    if( !arr.length ){
      const insert: any = await collection.insertOne({
        hall_name: 'Dummy Hall'
      });

      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }

  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateStages: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('stages');
    const arr: any[] = await collection.find({}).toArray();

    if( !arr.length ){
      const insert: any = await collection.insertOne({
        stage_name: 'Dummy Stage'
      });

      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }

  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateTables: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('tables');
    const arr: any[] = await collection.find({}).toArray();

    if( !arr.length ){
      const insert: any = await collection.insertOne({
        table_name: 'Dummy Table',
        capacty: 10
      });

      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }

  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


exports = module.exports = {
  doSetup: doSetup,
  populateEvents: populateEvents,
  populateSessions: populateSessions,
  populatePresenters: populatePresenters,
  populateHalls: populateHalls,
  populateStages: populateStages,
  populateTables: populateTables
};
