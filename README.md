# lycos-weather
NPM package to scrape Lycos's Weather pages.

Although there is no license on the code itself, Lycos owns the data itself.

Install on NPM via ``npm i lycos-weather``.

## Sample Code

This gets weather data in New York City.

```js
const lw = require("lycos-weather");
const q = "10007";
// new york ny zip code

lw.search(q, function(err, resp) {
    if (resp) {
        lw.get(resp[0].href, function (err, resp) {
            if (err) {
                console.log(err)
            } else {
                console.log(resp)
            }
        })
    } else {
        if (err.code == "oneResult") {
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
```