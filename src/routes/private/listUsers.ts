'use strict';

export{};
const mongoUtils: any = require('../../utils/mongodb');


const get: any = async (req: any, res: any) => {
  let rtnObj: any[] = [];

  let clientId: string = '';

  if( req.params.clientId ){
    clientId = req.params.clientId;
  }else if( req.session.client_id ){
    clientId = req.session.client_id;
  }

  try{
    /* start: get array of client users */
    if( clientId.length == 24 ){
      const client: any = await mongoUtils.connect('tier1');
      const db: any = await mongoUtils.getDb(client);
      const collection: any = await db.collection('users');
      const result: any[] = await collection
        .find({client_ids: clientId})
        .project({password_hash: 0})
        .sort({last_name: 1, first_name: 1, _id: 1})
        .toArray();
      await mongoUtils.close(client);
      //console.log('result:', result);
      rtnObj = result;
    }
    /* end: get array of client users */
    req.statusCode = 200;
  }catch( err: any ){
    req.statusCode = 400;
  }

  return rtnObj;
};


module.exports = {
  get: get
};
