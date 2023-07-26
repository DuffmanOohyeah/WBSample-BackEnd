'use strict';

export {};

const isLoggedIn: any = (req: any, res: any) => {
	let rtnBln: boolean = false;
	if (req.session && req.session.user_id) {
		rtnBln = true;
	} else {
		req.statusCode = 401; // 401 = unauthorised
		let message: string = encodeURIComponent(
			'Unauthorised: Please login to continue.'
		);
		res.redirect(302, `/cms?message=${message}`);
	}
	return rtnBln;
};

module.exports = {
	isLoggedIn: isLoggedIn,
};
