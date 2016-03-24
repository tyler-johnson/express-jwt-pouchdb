import minimist from "minimist";
import PouchDB from "pouchdb";

// using standard require so rollup doesn't include it
const createApp = require("./");

let argv = minimist(process.argv.slice(2), {
	string: [ ],
	boolean: [ "help", "version" ],
	alias: {
		h: "help", H: "help",
		v: "version", V: "version"
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

const app = createApp(PouchDB, argv);

const server = app.listen(argv.port || 3000, () => {
	console.log(`HTTP server listening on port ${server.address().port}.`);
});

server.on("error", panic);
