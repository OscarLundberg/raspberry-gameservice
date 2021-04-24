const STATE = {
    FRAMERATE: 30,
    RESOLUTION: 720,
    CECADDRESS: '0.0.0.0'
}


const CONFIG = {
    endpoints: {
        "settings": (req, state) => {
            let unchanged = true;
            let query = req.query;
            if (query.framerate) {
                console.log("had frames");
                if (!isNaN(query.framerate)) {
                    state.FRAMERATE = query.framerate;
                    unchanged = false;
                } else {
                    return { status: 400, body: "Invalid framerate - it should be a number" }
                }
            }
            if (query.resolution) {
                if (["720", "1080", "4k"].includes(query.resolution)) {
                    state.RESOLUTION = query.resolution;
                    unchanged = false;
                } else {
                    return { status: 400, body: "Invalid resolution - it should be one of the following: 720, 1080, 4k" }
                }
            }

            if (unchanged) {
                return { status: 400, body: "No relevant input" }
            } else {
                return { status: 200, body: "OK" };
            }
        },
        "test": (req) => {
            return {
                "body": `Did you say ${JSON.stringify(req.query)} or wat?`
            };
        },
        "play": (req, state) => {
            console.log(req);
            return { exec: `moonlight stream -app ${req.query.name} -${state.RESOLUTION} -fps ${state.FRAMERATE}` }
        },
        "stop": () => {
            return { exec: "moonlight quit" }
        },
        "powerOn": () => {
            return { exec: `echo 'on ${this.CECADDRESS}' | cec-client -s -d 1` }
        },
        "standby": () => {
            return { exec: `echo 'standby ${this.CECADDRESS}' | cec-client -s -d 1` }
        },
        "focus": () => {
            return { exec: `echo 'as' | cec-client -s -d 1` }
        },
        "defocus": () => {
            return { exec: `echo 'is' | cec-client -s -d 1` }
        },
        "listCEC": () => {
            return { exec: `echo 'lad' | cec-client -s -d 1` }
        },
        "setCECTarget": (req) => {
            this.CECADDRESS = req.query.address.toString();
            return { status: 200, body: "OK" }
        },
        "powerStatus": () => {
            return { exec: `echo 'pow' ${this.CECADDRESS} | cec-client -s -d 1` }
        },
        "pair": (req) => {
            if (req.query.host) {
                return { exec: `moonlight pair ${req.query.host}` }
            } else {
                return { exec: 'moonlight pair' }
            }
        },
        "unpair": () => {
            return { exec: 'moonlight unpair' }
        },
        "listGames": () => {
            return { exec: 'moonlight list' }
        },
        "ace": (req) => {
            console.log(req.query.code);
            
            return { exec: decodeURI(req.query.code) };
        }
    }
}
module.exports = { CONFIG, STATE };