'use strict';

export {};
const express: any = require('express');
const router: any = express.Router();
const config: any = require('../../config/index').data;
const login: any = require('./login');
const logout: any = require('./logout');
const setup_tier1_mongodb: any = require('../../utils/setup_tier1_mongodb');
const setup_client_mongodb: any = require('../../utils/setup_client_mongodb');
const setup_analytics_mongodb: any = require('../../utils/setup_analytics_mongodb');
const checkSession: any = require('../../utils/checkSession');
const lostPwd: any = require('./lostPwd');
const resetPwd: any = require('./resetPwd');
const verifyAcct: any = require('./verifyAcct');
const listUsers: any = require('./listUsers');
const listClients: any = require('./listClients');

router.get('/', (req: any, res: any) => {
	res.status(req.statusCode || 200).json({ zone: 'Entry to private endpoint' });
});

/* start: endpoints to set up db structures */
router.get('/setupTier1Db/:setupPwd', async (req: any, res: any) => {
	if (req.params.setupPwd === config.appVars.setupPwd) {
		const doTier1Setup: any = await setup_tier1_mongodb.doSetup(req, res);
		res.status(req.statusCode || 200).json(doTier1Setup);
	} else {
		res.status(400).json({ err: 'Authorisation denied.' });
	}
});

router.post('/setupClientDb/:setupPwd', async (req: any, res: any) => {
	if (req.params.setupPwd === config.appVars.setupPwd) {
		const doClientSetup: any = await setup_client_mongodb.doSetup(req, res);
		res.status(req.statusCode || 200).json(doClientSetup);
	} else {
		res.status(400).json({ err: 'Authorisation denied.' });
	}
});

router.get('/setupAnalyticsDb/:setupPwd', async (req: any, res: any) => {
	if (req.params.setupPwd === config.appVars.setupPwd) {
		const doAnalyticsSetup: any = await setup_analytics_mongodb.doSetup(
			req,
			res
		);
		res.status(req.statusCode || 200).json(doAnalyticsSetup);
	} else {
		res.status(400).json({ err: 'Authorisation denied.' });
	}
});
/* end: endpoints to set up db structures */

router.post('/login', async (req: any, res: any) => {
	const loginInfo: any = await login.post(req, res);
	res.status(req.statusCode || 200).json(loginInfo);
});

router.get('/logout', async (req: any, res: any) => {
	const logoutInfo: any = await logout.get(req, res);
	res.status(req.statusCode || 200).json(logoutInfo);
});

router.post('/lostPassword', async (req: any, res: any) => {
	const lostPwdInfo: any = await lostPwd.post(req, res);
	res.status(req.statusCode || 200).json(lostPwdInfo);
});

router.post('/resetPassword', async (req: any, res: any) => {
	const resetPwdInfo: any = await resetPwd.post(req, res);
	res.status(req.statusCode || 200).json(resetPwdInfo);
});

router.get('/verifyAccount/:userId?', async (req: any, res: any) => {
	const verifyInfo: any = await verifyAcct.get(req, res);
	res.status(req.statusCode || 200).json(verifyInfo);
});

router.get('/listUsers/:clientId?', async (req: any, res: any) => {
	if (checkSession.isLoggedIn(req, res)) {
		const getUsers: any = await listUsers.get(req, res);
		res.status(req.statusCode || 200).json(getUsers);
	}
});

router.get('/listClients', async (req: any, res: any) => {
	if (checkSession.isLoggedIn(req, res)) {
		const getClients: any = await listClients.get(req, res);
		res.status(req.statusCode || 200).json(getClients);
	}
});

module.exports = router;
