const lw = require("../index.js");
const q = "10007";
// new york ny zip code

console.log("- searching '" + q + "' in lycos weather");

lw.search(q, function(err, resp) {
    if (resp) {
        console.log(resp[0]);
        console.log("- getting '" + resp[0].location + "' on lycos");
        lw.get(resp[0].href, function (err, resp) {
            if (err) {
                console.log(err)
            } else {
                console.log(resp)
            }
        })
    } else {
        if (err.code == "oneResult") {
            console.log("[!] resolving the one result error")
            lw.get(err.url, function (err, resp) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(resp)
                }
            })
        } else {
            console.log(err);
        }
    }
})