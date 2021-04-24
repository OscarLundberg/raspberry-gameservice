const express = require('express');
const endpoints = require('endpoints.js');

var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

for (let key of Object.keys(endpoints)) {
    app.get(key, (req, res) => {
        let response;
        try {
            response = endpoints[key](req);
        } catch (e) {
            res.status(500).send(e);
        }
        res.status(200).send(response);
    });
}