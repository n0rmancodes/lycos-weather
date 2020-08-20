const got = require("got");
const cheerio = require("cheerio");
exports.search = (query, cb) => {
    got("http://weather.lycos.com/search/?location=" + query, {
        headers: {
            "Host": "weather.lycos.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Referer": "http://weather.lycos.com/",
            "Upgrade-Insecure-Requests": "1",
            "DNT": "1"
        }
    }).then(function(response) {
        if (response.request.redirects[0]) {
            var err = {
                "message": "Only one result, this means that Lycos automatically redirects to the only results page, meaning you should run the 'get' function.",
                "code": "oneResult",
                "url": "http://weather.lycos.com/search/?location=" + query
            }
            cb(err, null)
        }
        var $ = cheerio.load(response.body);
        if ($("body article section h1")) {
            if ($("body article section h1").text().includes("No Cities matching ")) {
                var err = {
                    "message": "No cities were found",
                    "code": "noResults",
                    "url": "http://weather.lycos.com/search/?location=" + query
                }
                cb(err, null)
                return err;
            } else if ($("body article section h1").text().includes("Cities matching")) {
                var array = [];
                for (var c in $(".row .column ul li a")) {
                    if (!$(".row .column ul li a")[c].children) {continue;}
                    if (!$(".row .column ul li a")[c].children[0]) {continue;}
                    if (!$(".row .column ul li a")[c].children[0].data) {continue;}
                    if ($(".row .column ul li a")[c].children[0].data == "!DOCTYPE html") {continue;}
                    var data = {
                        "location": $(".row .column ul li a")[c].children[0].data,
                        "href": "http://weather.lycos.com" + $(".row .column ul li a")[c].attribs.href
                    }
                    array.push(data);
                }
                cb(null, array);
                return array;
            }
        }
    }).catch(function(e) {
        cb(e, null)
    })
}

exports.get = (url, cb) => {
    got(url, {
        headers: {
            "Host": "weather.lycos.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Referer": "http://weather.lycos.com/",
            "Upgrade-Insecure-Requests": "1",
            "DNT": "1"
        }
    }).then(function(response) {
        var $ = cheerio.load(response.body);
        if ($(".currentNav") && $(".current-details")) {
            if ($(".current-temps .ultra2")[0]) {
                var temp = $(".current-temps .ultra2")[0].children[0].data;
            }
            if ($(".current-temps p .bold")[0]) {
                var hi = $(".current-temps .bold")[0].children[0].data;
            }
            if ($(".current-temps p .gamma")[0]) {
                var lo = $(".current-temps .gamma")[0].children[0].data;
            }
            if ($(".current-temps .degree")[0]) {
                var dg = $(".current-temps .degree")[0].children[0].data;
            }
            if ($(".details h2")[0]) {
                var cDesc = $(".details h2").text()
            } 
            if ($(".dailyLineItems li")[0]) {
                var curHu = $(".dailyLineItems li")[0].children[1].children[0].data;
            }
            if ($(".dailyLineItems li")[1]) {
                var curVi = $(".dailyLineItems li")[1].children[1].children[0].data;
            }
            if ($(".dailyLineItems li")[2]) {
                var curWs = $(".dailyLineItems li")[2].children[1].children[0].data;
            }
            if ($(".dailyLineItems li")[3]) {
                var curSr = $(".dailyLineItems li")[3].children[1].children[0].data;
            }
            if ($(".dailyLineItems li")[4]) {
                var curSn = $(".dailyLineItems li")[4].children[1].children[0].data;
            }
            if ($("#radarImage")[0]) {
                var rdr = $("#radarImage")[0].attribs.src;
            }
            if ($(".current-temps .makedefault")[0].children) {
                var loc = $(".current-temps .makedefault")[0].children[0].data;
            }
            var forecasts = [];
            if ($(".sixDay .row .forecastBlocks")[0]) {
                for (var c = 0; c < 6; c++) {
                    var wk = $(".sixDay .forecastBlocks .title")[c].children[0].data;
                    var hi = $(".sixDay .forecastBlocks .stuff .beta")[c].children[0].data;
                    var lo = $(".sixDay .forecastBlocks .stuff .gamma")[c].children[0].data;
                    var ds = $(".sixDay .forecastBlocks .stuff h3")[c].children[0].data;
                    var fd = {
                        "day": wk,
                        "highTemp": hi,
                        "lowTemp": lo,
                        "description": ds
                    }
                    forecasts.push(fd)
                }
            }
            var hbh = [];
            if ($(".hourly .row .forecastBlocks")[0].children) {
                for (var c = 0; c < 12; c++) {
                    var wk = $(".hourly .forecastBlocks .title")[c].children[0].data;
                    var avg = $(".hourly .forecastBlocks .hourlyTemp")[c].children[0].data;
                    for (var d in $(".hourly .forecastBlocks .reveal p")[c].children) {
                        if ($(".hourly .forecastBlocks .reveal p")[c].children[d].children) {
                            if ($(".hourly .forecastBlocks .reveal p")[c].children[d].children[0]) {
                                if ($(".hourly .forecastBlocks .reveal p")[c].children[d].children[0].parent.prev.data.includes("Precip")) {
                                    var pre = $(".hourly .forecastBlocks .reveal p")[c].children[d].children[0].data;
                                }
                                if ($(".hourly .forecastBlocks .reveal p")[c].children[d].children[0].parent.prev.data.includes("Wind")) {
                                    var win = $(".hourly .forecastBlocks .reveal p")[c].children[d].children[0].data;
                                }
                                if ($(".hourly .forecastBlocks .reveal p")[c].children[d].children[0].parent.prev.data.includes("Humidity")) {
                                    var hum = $(".hourly .forecastBlocks .reveal p")[c].children[d].children[0].data + "%";
                                }
                            }
                        }
                    }
                    var fd = {
                        "day": wk,
                        "averageTemp": avg,
                        "precipitation": pre,
                        "windSpeed": win,
                        "humidity": hum
                    }
                    hbh.push(fd)
                }
            }
            var data = {
                "current": {
                    "temp": temp,
                    "highTemp": hi,
                    "lowTemp": lo,
                    "description": cDesc,
                    "humidity": curHu,
                    "visibility": curVi,
                    "windSpeed": curWs,
                    "sunrise": curSr,
                    "sunset": curSn,
                    "radarData": rdr,
                },
                "forecasts": forecasts,
                "hourByHour": hbh,
                "mesaurement": dg,
                "location": loc
            }
            cb(null, data)
        } else {
            var err = {
                "message": "Failed to scrape.",
                "code": "failedScrape",
                "url": url
            }
            cb(err, null)
            return err;
        }
    }).catch(function(e) {
        cb(e, null)
    })
}