'use strict';

export{};
const mongoUtils: any = require('../../utils/mongodb');
const emailUtils: any = require('../../utils/email');
//const bcrypt: any = require('bcryptjs');


const post: any = async (req: any, res: any) => {
  const rtnObj: any = {};

  try{
    let email: string = (req.body.email || '').trim();
    let isValidEmail: boolean = emailUtils.validate(email);

    /* start: check email length */
    if( isValidEmail ){
      const result: any = await mongoUtils.getUser(email);  // returns object

      /* start: check result response */
      if( result._id ){
        const domain: string = await emailUtils.primaryDomain(result.client_ids[0]);

        if( !result.email_validated ){
          rtnObj.data = 'Your account needs confirmation; please check your inbox.';
          // TODO: send validation email
          if( domain.length ){
            // TODO: send nodemailer link
            let subject: string = `Please confirm your email with ${req.app.get('app_name')}`;
            let html: string = '<p>';
                html += 'In order to access the application, we\'d appreciate if you could confirm your email address by clicking the link below:';
                html += `<br /><br /><a href='${domain}private/verifyAccount/${result._id}'>${domain}private/verifyAccount/${result._id}</a>`;
                html += '<br /><br /> Thank you,';
                html += `<br />The ${req.app.get('app_name')} team`;
                html += '</p>';
            /*const emailInfo: any = await*/ emailUtils.send(email, subject, html);
          }
        }else if( result.account_suspended ){
          rtnObj.data = `Your account has been suspended; please contact ${req.app.get('wbsample_company_name')}.`;
          if( result.suspended_reason.length ){
            rtnObj.data += `\nSuspension reason: ${result.suspended_reason}`;
          }
        }else{
          rtnObj.data = 'Email reset link sent; please check your inbox.';
          // TODO: all is good - send email with pwd reset link
          if( domain.length ){
            let subject: string = `Your password reset link from ${req.app.get('app_name')}`;
            let html: string = '<p>';
                html += 'You\'ve requested to reset your password.';
                html += '<br />Please follow the link below:';
                html += `<br /><br /><a href='${domain}need_to_point_to_frontend_page'>${domain}need_to_point_to_frontend_page</a>`;
                html += '<br /><br /> Thank you,';
                html += `<br />The ${req.app.get('app_name')} team`;
                html += '</p>';

            /*const emailInfo: any = await*/ emailUtils.send(email, subject, html);
          }
        }

      }else{
        rtnObj.data = `Sorry, we cannot find that email: ${email}`;
      }
      /* end: check result response */

    }else{
      rtnObj.data = `Invalid email (${email}); please check again.`;
    }
    /* end: check email length */

    req.statusCode = 200;
  }catch( err: any ){
    rtnObj.err = err.message;
    req.statusCode = 400;
  }

  return rtnObj;
};


exports = module.exports = {
  post: post
};
