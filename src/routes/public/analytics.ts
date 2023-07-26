'use strict';

export{};
const mongoUtils: any = require('../../utils/mongodb');
const mongo: any = require('mongodb');
let dbAlias: string = 'analytics';
let collectionName: string = 'tracking';


const set: any = async (req: any) => {
  const rtnObj: any = { success: false };

  try{
    /* start: testing for dev env only!
    if( process.env.NODE_ENV == 'development' ){
      req.session.user_id = (req.session.user_id || '???');
      req.params.clientId = (req.params.clientId || '???');
      req.params.eventId = (req.params.eventId || '???');
    }
    end: testing for dev env only! */

    if( req.session.user_id ){
      const client: any = await mongoUtils.connect(dbAlias);
      const db: any = await mongoUtils.getDb(client);
      const collection: any = await db.collection(collectionName);

        const getResult: any = await exports.get(collection, req);

        switch( getResult.count ){
          case 0: // TODO: do insert
            await exports.insert(collection, req);  // returns boolean
          break;
          case 1: // TODO: do update
            //await exports.update(collection, getResult.id); // returns boolean
          break;
        }

      await mongoUtils.close(client);
      rtnObj.success = true;
    } // end: session id check

  }catch( err: any ){
    // supress any output as this endpoint should remain relatively silent
  }

  return rtnObj;
};


const get: any = async (collection: any, req: any) => {
  const rtnObj: any = {
    id: '',
    count: 0
  };
  try{
    const query: any = {
      user_id: req.session.user_id,
      end_date: ''
    };
    if( req.params.clientId ){
      query['client_id'] = req.params.clientId;
    }
    if( req.params.eventId ){
      query['event_id'] = req.params.eventId;
    }
    if( req.params.actionName ){
      query['action_name'] = req.params.actionName;
    }
    if( exports.getRemoteAddr(req).length ){
      query['remote_addr'] = exports.getRemoteAddr(req);
    }
    if( req.protocol ){
      query['protocol'] = req.protocol;
    }
    if( req.get('host') ){
      query['host'] = req.get('host');
    }
    if( req.get('user-agent') ){
      query['user_agent'] = req.get('user-agent');
    }

    const result: any[] = await collection
      .find(query)
      .sort({start_date: -1})
      .limit(1)
      .toArray();

    if( result.length ){
      rtnObj.id = result[0]._id;
      //console.log('result:', result);
    }
    rtnObj.count = result.length;
  }catch( err: any ){}
  return rtnObj;
};


const insert: any = async (collection: any, req: any) => {
  let rtnBln: boolean = false;
  try{
    await collection.insertOne({
        user_id: req.session.user_id,
        client_id: (req.params.clientId || 'Unknown client'),
        event_id: (req.params.eventId || 'Unknown event'),
        action_name: (req.params.actionName || 'Unknown action'),
        start_date: new Date(),
        end_date: '',
        remote_addr: exports.getRemoteAddr(req),
        protocol: (req.protocol || ''),
        host: (req.get('host') || ''),
        original_url: (req.originalUrl || ''),
        user_agent: (req.get('user-agent') || '')
      });
    rtnBln = true;
  }catch( err: any ){}
  return rtnBln;
};


const update: any = async (collection: any, id: string) => {
  let rtnBln: boolean = false;
  try{
    const o_id: any = new mongo.ObjectID(id);
    await collection.updateOne(
      { _id: o_id },
      { $set: { end_date: new Date() } }
    );
    rtnBln = true;
  }catch( err: any ){}
  return rtnBln;
};


const getRemoteAddr: any = (req: any) => {
  let rtnAddr: string = '';
  if( req.get('x-forwarded-for') ){
    rtnAddr = req.get('x-forwarded-for');
  }else{
    if( req.connection.remoteAddress ){
      rtnAddr = req.connection.remoteAddress;
    }
  }
  return rtnAddr;
};


exports = module.exports = {
  set: set,
  get: get,
  insert: insert,
  update: update,
  getRemoteAddr: getRemoteAddr
};
