'use strict';

export{};
const mongo: any = require('mongodb');
const mongoUtils: any = require('../../utils/mongodb');
const bcrypt: any = require('bcryptjs');


const post: any = async (req: any, res: any) => {
  const rtnObj: any = {};

  try{
    let userId: string = (req.body.userId || '').trim();
    let password: string = (req.body.password || '').trim();

    if( userId.length == 24 && password.length > 5 ){
      // TODO: hash & insert new pwd
      const o_id: any = new mongo.ObjectID(userId);
      const salt: any = bcrypt.genSaltSync(10);
      const hash: string = bcrypt.hashSync(password, salt);

      const client: any = await mongoUtils.connect('tier1');
      const db: any = await mongoUtils.getDb(client);
      const collection: any = await db.collection('users');
      const result: any = await collection.updateOne(
        { _id:  o_id },
        { $set: { password_hash: hash } }
      );
      await mongoUtils.close(client);
      
      if( result.modifiedCount ){
        rtnObj.data = 'Your password has been reset successfully.';
      }else{
        rtnObj.data = 'Your password did not update successfully.';
      }

    }else{
      // TODO: invalid credentials - can't reset pwd
      rtnObj.data = 'Sorry, your credentials are invalid.';
    }

    req.statusCode = 200;
  }catch( err: any ){
    rtnObj.err = err.message;
    req.statusCode = 400;
  }

  return rtnObj;
};


module.exports = {
  post: post
};
