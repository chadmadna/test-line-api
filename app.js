var http = require('http')
var sendJson = require('send-data/json')
var textBody = require('body')
var jsonBody = require('body/json')
var url = require('url')

var channelID = process.env.CHANNEL_ID
var channelSecret = process.env.CHANNEL_SECRET
var channelMID = process.env.CHANNEL_MID

var port = process.env.PORT || 3000

http.createServer(function (req, res) {
    console.log("Request received: " +
        req.url + "\n" +
        JSON.stringify(req.headers) + "\n"
        + req.body)
    function echo(err, body) {
        if (err) console.log(err)

        if (body.eventType === 138311609000106303) {
            sendJson(req, res, {
                body: {
                    "to": body.from,
                    "toChannel": 1383378250,
                    "eventType": "138311608800106203",
                    "content": {
                        "contentType": 1,
                        "toType": 1,
                        "text": body.content.text
                    }
                },
                statusCode: 200,
                headers: {
                    'X-Line-ChannelID': channelID,
                    'X-Line-ChannelSecret': channelSecret,
                    'X-Line-Trusted-User-With-ACL': channelMID
                }
            })
        }
        console.log(body.content.text)
    }
    if (url.parse(req.url, true).pathname === '/line') {
        jsonBody(req, res, echo);
    } else {
        textBody(req, res, function (err, body) {
            if (err) console.log(err)
            sendJson(req, res, "It works!")
        })
    }
}).listen(port)
console.log('HTTP server listening at ' + port)