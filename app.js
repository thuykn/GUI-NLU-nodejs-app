/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//new code from https://github.com/watson-developer-cloud/node-sdk/blob/master/examples/natural_language_understanding.v1.js
'use strict';
const fs = require('fs');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
require('dotenv').config({ silent: true }); //  optional

const nlu = new NaturalLanguageUnderstandingV1({
  // note: if unspecified here, credentials are pulled from environment properties:
  // NATURAL_LANGUAGE_UNDERSTANDING_USERNAME &  NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD
  username: 'bd0de0e7-31d4-45ee-8c27-cf8aa854c69a',
  password: 'AeHrMr33yi0H',
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
});

const filename = 'energy-policy.html';

app.get('/', function(req, res) {
  fs.readFile(filename, 'utf-8', function(file_error, file_data) {
    if (file_error) {
      console.log(file_error);
    } else {
      const options = {
        html: file_data,
        features: {
          concepts: {},
          keywords: {}
        }
      };
      nlu.analyze(options, function(err, jsonResult) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(JSON.stringify(jsonResult,null,2));
        //res.send(JSON.stringify(jsonResult,null,2));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(jsonResult,null,2));
      });
    }
  });	  
});

// end of new code

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
