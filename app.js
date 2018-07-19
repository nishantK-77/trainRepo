const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const dbHandler = require('./lib/database');

const jwt = require('jsonwebtoken');
var coded = jwt.sign("CLASSPLUS", 'XPREP');

// console.log(coded);
// var decoded = jwt.verify(coded, "XPREP");
// var decrypted = jwt.decode(coded, {complete: true});
// console.log(decrypted.header);
// console.log(decrypted.payload);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', routes);

app.use((req, res, next) => {
	// Expose the custom headers so that browser can allow to use it
	res.setHeader('Access-Control-Expose-Headers','X-Powered-By, X-Auth');
	next();
});

app.listen(8000, function(){
	console.log("Express server running on port 8000");
})

// process.on('unhandledRejection', up => { throw up })