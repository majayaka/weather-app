const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require('dotenv').config();

const app = express()

const apiKey = process.env.API_KEY;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`


  request(url, function (err, response, body) {
    if (err) {
      res.render('index', { weather: null, error: 'Error, please try again' });
    } else {
      let weather = JSON.parse(body);
      if (weather.main == undefined) {
        res.render('index', { weather: null, error: 'Error, please try again' });
      } else {
        
        let weatherDescription = weather.weather[0].description;
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}, and the weather is ${weatherDescription}.`;
        
        res.render('index', { weather: weatherText, error: null });
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})