const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine","ejs")
const https = require("https");
const http = require("http")
const clone = require("clone")
require('dotenv').config();


let cities = [];


let cityInfo = {
  cityName:"",
  temparature:"",
  feelslike:"",
  weatherIcon:""
}
let homecity = {
  cityName:"",
  temparature:"",
  feelslike:"",
  weatherIcon:""
}
app.get("/", (req, res) => {
  res.render("index",{
   city:cities,h_name:homecity.cityName,h_temp:homecity.temparature,h_icon:homecity.weatherIcon
   ,h_feels:homecity.feelslike
   })

});
function getIpAdress(){
  const url = "http://api.ipstack.com/check?access_key="+process.env.IP_KEY;
  http.get(url,(response)=>{
    response.on("data",(d)=>{
      const ipData = JSON.parse(d);
      const url = "https://api.openweathermap.org/data/2.5/weather?q=" +ipData.location.capital + "&appid="+process.env.WEATHER_KEY +  "&units=metric";
      https.get(url, function(response) {
         response.on("data", (d) => {
          const homeWeatherData = JSON.parse(d);
          const icon = homeWeatherData.weather[0].icon;
          const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
          homecity.temparature = homeWeatherData.main.temp;
          homecity.feelslike = homeWeatherData.weather[0].description;
          homecity.weatherIcon = " src=" + imgURL ;
          homecity.cityName = ipData.location.capital;
      
        })

      })   
    })

  })
}

app.post("/", (req, res) => {
  cityInfo.cityName = req.body.city;
  console.log(cityInfo.cityName)
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +cityInfo.cityName + "&appid="+process.env.WEATHER_KEY+"&units=metric";
  console.log(url);
  https.get(url, function(response) {
    // console.log(response);
    response.on("data", (d) => {
      const weatherData = JSON.parse(d);
      // console.log(weatherData)
      console.log("the code is "+response.statusCode)
      if(response.statusCode === 200){
     const icon = weatherData.weather[0].icon;
     const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
     cityInfo.feelslike= weatherData.weather[0].description 
     cityInfo.temparature = weatherData.main.temp 
     cityInfo.weatherIcon = " src=" + imgURL ;
    // cities.forEach(element => {
      // if(element.cityName !=cityInfo.cityName){
        temp = clone(cityInfo)
        cities.push(temp);

      //  }
    //  });

     console.log(cities);
      

   res.redirect("/")
      }else{res.send("<h1>Please provide a Valid city name and try again</h1>")}

   });
   response.on("error",(error)=>{
     console.log(error)
     res.redirect("/")
   })

  });
});
getIpAdress();
app.listen(process.env.PORT, () => {
  console.log("server is Runing on port 3001");
});
