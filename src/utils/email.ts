'use strict';

export{};
const mongoUtils: any = require('./mongodb');
const mongo: any = require('mongodb');
const nodemailer: any = require('nodemailer');
const config: any = require('../config').data;


const validate: any = (email: string) => {
  const re: any = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());  // returns boolean
};


const primaryDomain: any = async (clientId: string, eventId: string = '') => {
  let rtn: string = '';
  let clientDbInstance: string = '';

  try{
    if( clientId.length == 24 ){

      const o_id1: any = new mongo.ObjectID(clientId);

      /* start: get db instance */
      const client: any = await mongoUtils.connect('tier1');
      const db: any = await mongoUtils.getDb(client);
      const collection: any = await db.collection('clients');
      const result: any = await collection
        .find(
          { _id: o_id1 },
          { projection: { _id: 0, clientdb_instance: 1 } }
        )
        .limit(1)
        .toArray();
      await mongoUtils.close(client);
      /* end: get db instance */

      if( result.length ){
        if( result[0].clientdb_instance && result[0].clientdb_instance.length ){
          clientDbInstance = result[0].clientdb_instance;
        }
      }

    }

  }catch( err: any ){
    // TODO: can't find primary domain for user
  }

  //console.log('clientDbInstance:', clientDbInstance);

  /* start: get domain from db instance */
  if( clientDbInstance.length ){
    const eventPD: any = exports.getEvent(clientDbInstance, clientId, eventId);
    rtn = eventPD;
  }
  /* end: get domain from db instance */

  return rtn;
};


const getEvent: any = async (clientDb: string, clientId: string, eventId: string) => {
  let rtn: string = '';

  try{

    const query: any = {
      client_id: new mongo.ObjectID(clientId)
    };
    if( eventId.length ){
      query['_id'] = new mongo.ObjectID(eventId);
    }

    const client: any = await mongoUtils.connect(clientDb);
    const db: any = await mongoUtils.getDb(client);
    const collection: any = await db.collection('events');
    const result: any = await collection
      .find(
        query,
        { projection: { _id: 0, primary_domain: 1 } }
      )
      .limit(1)
      .toArray();
    await mongoUtils.close(client);

    //console.log('query:', query);
    //console.log('result:', result);

    if( result.length ){
      if( result[0].primary_domain && result[0].primary_domain.length ){
        let priDom: string = result[0].primary_domain;
        if( priDom.substr(0, 4) !== 'http' ){
          rtn += 'http://';
        }
        rtn += priDom;
        if( priDom.substr(priDom.length - 1, 1) !== '/' ){
          rtn += '/';
        }
      }
    }

  }catch( err: any ){
    // no event found
  }

  return rtn;
};


const send: any = async (toEmail: any, subject: string, html: string) => {
  const rtnObj: any = {};

  try{

    const emailPkg: any = {
      from: config.appVars.wbSampleFromEmail,
      to: '',
      subject: (subject || 'No subject'),
      html: (html || '<p>No body</p>'),
      text: ''
    };

    if( Array.isArray(toEmail) ){
      emailPkg.to = toEmail.join();
    }else if( typeof toEmail == 'string' ){
      emailPkg.to = toEmail;
    }

    if( emailPkg.to ){
      const transporter: any = nodemailer.createTransport(config.smtpVars);
      const info: any = await transporter.sendMail(emailPkg);
      //console.log('info:', info);
      if( info.messageId ){
        rtnObj.data = 'Email has been sent successfully.';
      }else{
        rtnObj.data = 'An error occurred when sending the email.';
      }
    }else{
      rtnObj.data = 'To field is required to send emails.';
    }

  }catch( err: any ){
    rtnObj.err = err.message;
  }

  return rtnObj;
};


exports = module.exports = {
  validate: validate,
  primaryDomain: primaryDomain,
  getEvent: getEvent,
  send: send
};
