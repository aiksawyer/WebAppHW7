

/////instead of a big pool of GIphs from GIPHY, pull GIFs into your own JSON
/////with assigned keywords



//setting up express and ejs here
var express = require('express');
var app = express();
var ejs = require('ejs');
var socket = require('socket.io')
const fs = require('fs');

////commit test
///setting up bodyParser
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
let userFile = fs.readFileSync('users.json');
let userData = JSON.parse(userFile);


///hide apiKey later
const apiKey = 'wNNhHJV0lMfl1r1nyXaQr4iB6TeqqwO5';
console.log(apiKey)

// sign up page here
app.get('/', function(req, res){
  res.render('signup', {success: null, error: null});
});

app.post('/', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let confirmUser = false;

  for (let i=0; i<userData.length; i++){
    if (userData[i].username === username){
      confirmUser = true;  
    }
  }

  if (confirmUser){
    res.render('signup', {success: null, error: 'Username already exists, try again!'});
  }else{
    if (password === password2){
      userData.push({username: username, password: password});
      let finalData = JSON.stringify(userData);
      fs.writeFile('users.json', finalData, finished);
      function finished(err) {
        console.log(req.body);
      }
      res.render('signup', {success: "Welcome, new user!"});
    }else{
      res.render('signup', {success: null, error: "Passwords have to be the same!"});
      console.log(password, password2);

    }   
  }
});

// log in page here
app.get('/log', function(req, res){
  res.render('log', {error: null});
});

app.post('/log', function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  let gotUser = false;
  let userIndex = null;

  ///check for user and password
  for (let i=0; i<userData.length; i++){
    if (userData[i].username === username){
      gotUser = true;
      userIndex = i;
    }
  }

  if (gotUser){
    if (password === userData[userIndex].password){
      res.redirect('/gif');
    }else{ 
      res.render('log', {error: 'Incorrect password, try again!'});
    }
  }else{
    res.render('log', {error: 'User not found'});
  }

});

app.get('/gif', function (req, res) {
  res.render('index', {gifUrl: null, error: null});
})


////the main page here
app.post('/gif', function (req, res) {
  let search = req.body.search;
  ///user's apiKey goes here
  let url = `http://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {gifUrl: null, error: 'Oops, something went wrong. Try again!'});
    } else {
      let giphy = JSON.parse(body)

      ///to vary the search
      var randomNum = Math.floor((Math.random() * 30) + 0)

      if(giphy.data[randomNum] == undefined){
        res.render('index', {gifUrl: null, error: 'Oops, something went wrong. Try again!'});
      } else {
        let giphyUrl = giphy.data[randomNum].images.original.url;
        res.render('index', {gifUrl: giphyUrl, error: null});
        console.log("got a gif");
      }
    }
  });
})

app.listen(3000, function(){
  console.log('Example app listening on port 3000!')
})




////testing socket

var io = new socket(app.listen());

io.on('connection', function(socket){
  console.log('socket made connection')
})







