const  expressjwt = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET;
	const api = process.env.API_URL

   return expressjwt.expressjwt({
     secret,
     algorithms: ["HS256"],
   }).unless({
		path: [
			{url: /\api\/v1\/auth(.*)/, methods: [ 'POST', "OPTIONS"]},
			{url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"]},
			{url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
			{url: '/',methods: ["GET", "OPTIONS"]}
		]
	 });
}


module.exports = authJwt;
