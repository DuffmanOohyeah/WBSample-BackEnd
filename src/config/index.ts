'use strict';

export {};
let rootDir: string = process.cwd() + '\\';
let envName: string = process.env.NODE_ENV || 'development';
export const configTemplate: any = require('./_' + envName); // default to './_development'

configTemplate.appVars = configTemplate.appVars || {};
configTemplate.appVars['envName'] = envName;
configTemplate.appVars['rootDir'] = rootDir;
configTemplate.appVars['setupPwd'] = '???'; // this should be constant per environment
configTemplate.appVars['appName'] = 'WBSample';
configTemplate.appVars['chatName'] = 'WBSampleChat';
configTemplate.appVars['wbSampleCompanyName'] = 'WBSample';
configTemplate.appVars['wbSampleFromEmail'] =
	'No Reply <no-reply@wbSample.app>';
