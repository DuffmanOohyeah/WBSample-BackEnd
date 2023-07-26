'use strict';

export{};


const get: any = async (req: any, res: any) => {
  const rtnObj: any = {};
  try{
    req.session.destroy();
    rtnObj.data = 'Logged out successfully.';
  }catch( err: any ){
    rtnObj.err = err.message;
  }
  return rtnObj;
};


module.exports = {
  get: get
};
