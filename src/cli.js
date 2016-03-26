import minimist from "minimist";
import PouchDB from "pouchdb";
import path from "path";
import mkdirp from "mkdirp";

// using standard require so rollup doesn't include it
const createApp = require("./");

let argv = minimist(process.argv.slice(2), {
	string: [ ],
	boolean: [ "help", "version" ],
	alias: {
		h: "help", H: "help",
		v: "version", V: "version",
		m: "in-memory",
		d: "dir",
		p: "port"
	},
	default: {
		dir: "./",
		port: process.env.PORT || 3000
	}
});

if (argv.help) {
	console.log("halp plz");
	process.exit(0);
}

if (argv.version) {
	let pkg = require("./package.json");
	console.log("%s %s", pkg.name, pkg.version || "edge");
	process.exit(0);
}

function panic(e) {
	console.error(e.stack || e);
	process.exit(1);
}

var opts = {};

opts.prefix = path.resolve(argv["dir"]) + path.sep;
mkdirp.sync(opts.prefix);

if (argv["level-prefix"]) {
	opts.prefix = argv["level-prefix"];
}
if (argv["in-memory"]) {
	opts.db = require("memdown");
} else if (argv["level-backend"]) {
	opts.db = require(argv["level-backend"]);
} else if (argv["sqlite"]) {
	opts.adapter = "websql";
}

const app = createApp(PouchDB.defaults(opts), argv);

const server = app.listen(argv.port, () => {
	console.log(`HTTP server listening on port ${server.address().port}.`);
});

server.on("error", panic);
