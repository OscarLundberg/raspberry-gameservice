
module.exports = {
    "settings": (req) => {
        let unchanged = true;
        let query = req.query;
        if (query.framerate) {
            console.log("had frames");
            if (!isNaN(query.framerate)) {
                FRAMERATE = query.framerate;
                unchanged = false;
            } else {
                return { status: 400, body: "Invalid framerate - it should be a number" }
            }
        }
        if (query.resolution) {
            if (["720", "1080", "4k"].includes(query.resolution)) {
                RESOLUTION = query.resolution;
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
    "play": (req) => {
        console.log(req);
        return { exec: `moonlight stream ${req.query.name} -${RESOLUTION} -fps ${FRAMERATE}` }
    },
    "stop": () => {
        return { exec: "moonlight quit" }
    },
    "powerOn": () => {
        return { exec: `echo 'on ${CECADDRESS}' | cec-client -s -d 1` }
    },
    "standby": () => {
        return { exec: `echo 'standby ${CECADDRESS}' | cec-client -s -d 1` }
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
        CECADDRESS = req.address.toString();
        return { status: 200, body: "OK" }
    }
    // "reboot": () => {
    //     return { exec: "reboot" }
    // }
}