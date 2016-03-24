import utils from "express-pouchdb/lib/utils";
import jwt from "jsonwebtoken";

// mimics couch_jwt_auth for express-pouchdb
export default function(pouchapp) {
	let authhandlers = (pouchapp.couchConfig.get("httpd", "authentication_handlers") || "").split(",");
	authhandlers.unshift("{couch_jwt_auth, jwt_authentication_handler}");
	pouchapp.couchConfig.set("httpd", "authentication_handlers", authhandlers.filter(Boolean).join(","), ()=>{});
	pouchapp.couchConfig.registerDefault("jwt_auth", "username_claim", "sub");
	pouchapp.couchConfig.registerDefault("jwt_auth", "roles_claim", "roles");

	pouchapp.use(function(req, res, next){
		req.couchSession.info.authentication_handlers.push("jwt");

		// decode the secret
		let secret = pouchapp.couchConfig.get("jwt_auth", "hs_secret") || "";
		secret = new Buffer(secret, "base64").toString("utf-8");

		// ignore requests that are already authenticated
		if (req.couchSession.userCtx.name) return next();

		// ignore requests without authorization
		let auth = req.get("authorization");
		if (!auth || !/^Bearer /.test(auth)) return next();

		let token = auth.substr(6).trim();
		let payload;

		try {
			payload = jwt.verify(token, secret, {
				algorithms: ["HS256"]
			});
		} catch(e) {
			return utils.sendError(res, e, 401);
		}

		if (typeof payload.name !== "string") payload.name = null;
		if (!Array.isArray(payload.roles)) payload.roles = [];

		req.couchSession.userCtx.name = payload.name;
		req.couchSession.userCtx.roles = payload.roles;
		req.couchSession.info.authenticated = "jwt";

		return next();
	});
}
