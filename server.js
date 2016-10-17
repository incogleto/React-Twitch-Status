// server.js
// where your node app starts

var jsxtransform = require('express-jsxtransform'),
    express = require('express'),
    request = require('request'),
    promise = require('promise'),
    app = express();
    
app.use(jsxtransform());
app.use(express.static('public'));
app.get('/twitch', function(req, res){
        request({
          url: "https://api.twitch.tv/kraken/" + req.query.type  + "/" + req.query.user,
          headers: { "Client-ID": process.env.CLIENTID}
        },
        function(error, response, body){
          if(error){
            throw error;
          }
          res.json(body);
        }
)});

app.server = app.listen(3000, function() {
  console.log('App listening on port 3000');
})
