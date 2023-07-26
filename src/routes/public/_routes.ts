'use strict';

export {};
const express: any = require('express');
const router: any = express.Router();
//const config: any = require('../../config/index').data;
const analytics: any = require('./analytics');

/*
const socket: any = require('socket.io');
const io: any = require('socket.io-client');

const socket: any = io({
  path: '/socket.io',
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  autoConnect: true,
  query: {},
  // options of the Engine.IO client
  upgrade: true,
  forceJSONP: false,
  jsonp: true,
  forceBase64: false,
  enablesXDR: false,
  timestampRequests: true,
  timestampParam: 't',
  policyPort: 843,
  transports: ['polling', 'websocket'],
  transportOptions: {},
  rememberUpgrade: false,
  onlyBinaryUpgrades: false,
  requestTimeout: 0,
  protocols: [],
  // options for Node.js
  agent: false,
  pfx: null,
  key: null,
  passphrase: null,
  cert: null,
  ca: null,
  ciphers: [],
  rejectUnauthorized: true,
  perMessageDeflate: true,
  forceNode: false,
  localAddress: null,
  // options for Node.js / React Native
  extraHeaders: {},
});
*/

router.get('/', (req: any, res: any) => {
	//req.session.userName = 'dummyUser'; // for testing only
	res
		.status(req.statusCode || 200)
		.json({ zone: `Welcome to test ${req.app.get('app_name')}! Public Area` });
});

router.get('/chat', (req: any, res: any) => {
	res.status(req.statusCode || 200).json({ zone: 'Chat homepage' });
});

router.get('/chat/room', (req: any, res: any) => {
	res.status(req.statusCode || 200).json({ zone: 'Chat room' });
});

router.get('/chat/allMessages', (req: any, res: any) => {
	res.status(req.statusCode || 200).json({ zone: 'Chat all messages' });
});

router.get('/chat/addUser', (req: any, res: any) => {
	res.status(req.statusCode || 200).json({ zone: 'Chat add user' });
});

router.get('/chat/removeUser', (req: any, res: any) => {
	res.status(req.statusCode || 200).json({ zone: 'Chat remove user' });
});

router.get(
	'/analytics/:actionName?/:clientId?/:eventId?',
	async (req: any, res: any) => {
		const doTracking: any = await analytics.set(req);
		res.status(req.statusCode || 200).json(doTracking);
	}
);

/*router.get('/wbsamplechat', (req: any, res: any) => {
  let htmPath: string = config.appVars.rootDir + 'src\\demos\\wbsamplechat.htm';
  //console.log('htmPath:', htmPath);
  res.sendFile(htmPath);
});*/

module.exports = router;
