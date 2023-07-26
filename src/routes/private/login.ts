'use script';

export{};
const mongoUtils: any = require('../../utils/mongodb');
const bcrypt: any = require('bcryptjs');
const mongo: any = require('mongodb');


const post: any = async (req: any, res: any) => {
  const rtnObj: any = {};

  try{
    const client: any = await mongoUtils.connect('tier1');
    const db: any = await mongoUtils.getDb(client);
    /*const result: any[] = await db.collection('users')
      .find({email: req.body.email.trim()})
      .limit(1)
      .toArray();*/
    const result: any = await db.collection('users')
      .aggregate(
        { $lookup: {
          localField: 'title_id',
          from: 'titles',
          foreignField: '_id',
          as: 'titlesArr'
        }},
        { $unwind: {
          path: '$titlesArr',
          preserveNullAndEmptyArrays: true
        }}
      )
      .limit(1)
      .toArray();
    await mongoUtils.close(client);

    /*const salt: any = bcrypt.genSaltSync(10);
    const hash: string = bcrypt.hashSync(req.body.password, salt);
    console.log('hash:', hash);*/

    let pwdMatch: boolean = false;

    switch( result.length ){
      case 0:
        rtnObj.data = 'Email not found in database.';
      break;
      default:
        pwdMatch = bcrypt.compareSync(req.body.password, result[0].password_hash); // plain text vs hash
      break;
    }

    let allowLogin: boolean = false;

    if( pwdMatch ){
      // TODO: check if email email_validated
      if( !result[0].email_validated ){
        rtnObj.data = 'Account needs to be confirmed.';
        allowLogin = false;
      }else{
        allowLogin = true;
      }

      // TODO: check if acct suspended
      if( result[0].account_suspended ){
        rtnObj.data = (result[0].suspended_reason || `Account suspended; please contact ${req.app.get('app_name')}.`);
        allowLogin = false;
      }else{
        allowLogin = true;
      }
    }else{
      rtnObj.data = 'Password is invalid.';
    }

    /* start: session vars & update login date */
    if( allowLogin ){
      req.session.user_id = result[0]._id;
      req.session.first_name = result[0].first_name;
      req.session.last_name = result[0].last_name;
      req.session.email = result[0].email;
      if( result[0].titlesArr.length ){
        req.session.title = result[0].titlesArr[0].title;
      }
      if( result[0].client_ids.length == 1 ){ // only one client associated; session it
        req.session.client_id = result[0].client_ids[0];
      }else{
        // TODO: we need some kind of logic to determine which client id to associate
        req.session.client_id = result[0].client_ids[0];  // for now, just grab the first in the array
      }
      rtnObj.data = `Welcome ${req.session.first_name}.`;

      const o_id: any = new mongo.ObjectID(req.session.user_id);
      const client2: any = await mongoUtils.connect('tier1');
      const db2: any = await mongoUtils.getDb(client2);
      await db2.collection('users').updateOne(
        { _id: o_id },
        { $set: { last_login_date: new Date() } }
      );
      await mongoUtils.close(client2);
      //console.log('req.session:', req.session);
    }else{
      req.session.destroy();
    }
    /* end: session vars & update login date */

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
