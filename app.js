var http = require('http')
var request = require('request')
var jsonBody = require('body/json')
var url = require('url')

var channelID = process.env.CHANNEL_ID
var channelSecret = process.env.CHANNEL_SECRET
var channelMID = process.env.CHANNEL_MID

var responseHeader = {
    'Content-Type': 'application/json',
    'X-Line-ChannelID': channelID,
    'X-Line-ChannelSecret': channelSecret,
    'X-Line-Trusted-User-With-ACL': channelMID
}
var responseBody = function (msg) {
    return {
        "to": [msg.content.from],
        "toChannel": 1383378250,
        "eventType": "138311608800106203",
        "content": {
            "contentType": 1,
            "toType": 1,
            "text": msg.content.text
        }
    }
}

var port = process.env.PORT || 3000

http.createServer(function (req, res) {

    var reqUrl = url.parse(req.url, true).pathname

    if (reqUrl === '/line') {
        jsonBody(req, res, function (err, body) {
            if (err) return console.log(err)
            console.log('Receiving JSON request')
            console.log(JSON.stringify(body, null, 4))
            res.writeHead(200)
            res.end()
            echo(err, body)
        });
    }

    else if (reqUrl === '/') {
        res.end('It works!')
    }

    function echo(err, body) {
        if (err) console.log(err)

        var result = body.result
        
        for (var i = 0; i < result.length; i++) {
            var msg = result[i]
            var jsonBody = responseBody(msg)
            if (msg.eventType === "138311609000106303") {
                console.log('Sending JSON response')
                console.log('Headers:')
                console.log(JSON.stringify(responseHeader, null, 4))
                console.log('Body:')
                console.log(JSON.stringify(jsonBody, null, 4))
                request.post('https://trialbot-api.line.me/v1/events', {
                    headers: responseHeader,
                    body: jsonBody, json:true
                }, function (err, res, body) {
                    console.log(JSON.stringify(body, null, 4))
                })
            }
        }
    }
    
}).listen(port)
console.log('HTTP server listening at ' + port)