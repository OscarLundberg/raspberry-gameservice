const { execSync } = require('child_process');

const express = require('express');
const endpoints = require('./endpoints');
require('child_process');
let FRAMERATE = 30;
let RESOLUTION = 720;
let CECADDRESS = '0.0.0.0';
let GLOBAL_TIMEOUT;
let keepAlive = false;

var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

for (let key of Object.keys(endpoints)) {
    app.get(`/${key}`, (req, res) => {
        GLOBAL_TIMEOUT = setTimeout(() => {
            respond(408, {}, res);
        }, 10000)
        console.log("Incoming request...");
        keepAlive = false;
        let response;
        try {
            response = endpoints[key](req);
            if (response.exec) {
                keepAlive = true;
                let result = execSync(response.exec);
                respond(200, { status: "200", body: result.toString()}, res);
                delete response.exec;
            }
        } catch (e) {
            keepAlive = false;
            response = { status: 500, error: e.toString() };
        }

        if (!keepAlive) {
            let status = response.status || "200";
            respond(status, response, res)
        }
    });
}

function respond(status, body, res) {
    res.status(status).send(body);
    console.log(`Responded with ${status} - ${body}`);
    clearTimeout(GLOBAL_TIMEOUT);
}