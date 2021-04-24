// const { spawn } = require('child_process');
const { execSync } = require('child_process');


const express = require('express');
let { CONFIG, STATE } = require('./config');

let GLOBAL_TIMEOUT;
let keepAlive = false;

var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

for (let key of Object.keys(CONFIG.endpoints)) {
    app.get(`/${key}`, (req, res) => {
        GLOBAL_TIMEOUT = setTimeout(() => {
            respond(408, {}, res);
        }, 10000)
        console.log("Incoming request...");
        keepAlive = false;
        let response;
        try {
            response = CONFIG.endpoints[key](req, STATE);
            if (response.exec) {
                keepAlive = true;

                let result;
                // result = execa(response.exec);

                const subprocess = execSync(response.exec);
                // subprocess.stdout.pipe(process.stdout);
                respond(200, subprocess, res);
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