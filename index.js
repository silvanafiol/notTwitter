'use strict';
//de todos estos modulos solo http es un modulo interno, el resto los tengo que intalar con pm install
var http = require('http');
var serveStatic = require('serve-static');
var serve = serveStatic('public');
var minimist = require('minimist');

var argv = minimist(process.argv);
var users = {}; //en realidad en concepto este objeto es mas un tweetsByUser

/* formato tipo del objeto users es:
var tweetsByUsers = { 
        user1 : [
            { text:'tweet1', timestamp: 0, user:{name:'user1'}},
            { text: 'tweet2', timestamp: , user:{name:'user1'}}
        ],
        user2 : [
            { text:'tweet1', timestamp: 0, user:{name:'user2'}},
            { text: 'tweet2', timestamp: 1, user:{name:'user2'}}
        ]
    };
*/
var tweets;

var server = http.createServer(function(req, res) {
        console.log('estoy en el servidor , recibí la petición', users);
    if (req.url === '/data') {        
        if (req.method === 'GET') {

            console.log('estoy en el servidor, en el GET, el url era /data');

            tweets = [];
            res.writeHead(200, {'Content-Type': 'application/json'});

            // por cada user en users, si es distinto a req.headers.user,
            // entonces recorrer su array de tweets ->
            // por cada tweet, preguntar si su propiedad timestamp es mayor
            // a req.headers.timestamp, si lo es entonces agregar el tweet
            // en cuestión al array tweets
//------------------------------------------
            Object.keys(users).forEach(function(curUser) {
                console.log('servidor curUser '+ curUser + 'req.headers.user ' + req.headers.user );
                if (curUser === req.headers.user) return;

                var arrUserTweets = users[curUser]; //array de objetos de ese usuario cada objeto es un tweet

                arrUserTweets.forEach(function(curTweet){
                    if(curTweet.timestamp > req.headers.timestamp){
                        tweets.push(curTweet.text);
                    }
                });
            });

            // responder el contenido de tweets transformado a string

                //res.writeHead(200);
                res.end(JSON.stringify(tweets)); //este es el array de tipo de objeto q devuelve
//-----------------------------------------
            return;
        }
    }

    var tweet;

    if (req.url === '/tweet') {
        if (req.method === 'POST') {
            console.log('estoy en el servidor, en el POST, el url era /tweet');
            tweet = '';
            req.setEncoding('utf8');

            req.on('data', function(data) {
                tweet += data;
            });

            req.on('end', function() {
                tweet = JSON.parse(tweet);
                tweet.timestamp = req.headers.timestamp;
                tweet.user = {
                    name: req.headers.user
                };
                if (users[req.headers.user]) {
                    users[req.headers.user].push(tweet);
                } else {
                    users[req.headers.user] = [tweet];
                }
                res.writeHead(200);
                res.end('{}');
            });
            return;
        }
    }

    // parte dónde sirvo contenido estático
    serve(req, res, function() {
        res.end();
    });
});

var port = argv.port || process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8000;

server.listen(port, argv.ip || process.env.OPENSHIFT_NODEJS_IP, function() {
    console.log('Server is now listening at port: ' + port);
});