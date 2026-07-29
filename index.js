import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

env.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/weather-stats", async (req, res) => {
    const city = req.query.location;
    try {
        // Geocoding API: get lat & lon for the given city
        const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        if (geoResponse.data.length === 0) {
            console.log("❌ Invaild city name");
            return res.redirect("/");
        }
        const latitude = geoResponse.data[0].lat;
        const longitude = geoResponse.data[0].lon;
        console.log(`Latitude of ${city} = ${latitude} and Longitude of ${city} = ${longitude}`);

        // Main weather API call:
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
        const desc = weatherResponse.data.weather[0].description;
        const formattedDesc = desc.split(" ")   // splits the string into an array of words wherever there’s a space. "clear sky" → ["clear", "sky"]
            // .map() loops through each word in the array.
            // word.charAt(0).toUpperCase() takes the first letter and makes it uppercase.
            // word.slice(1) takes the rest of the word (without the first character).
            // Adding them together gives the word with its first letter capitalized.
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");    // joins the array back into a single string, separating each word with a space.

        res.render("weather-stats.ejs", {
            weatherDescription: formattedDesc,
            icon: weatherResponse.data.weather[0].icon,    ///get icon and use switch statement to chnage icon based on code 
            temperature: (weatherResponse.data.main.temp - 273.15).toFixed(1), // Converted Kelvin -> °Celsius
            feelsLike: (weatherResponse.data.main.feels_like - 273.15).toFixed(1),
            minTemp: (weatherResponse.data.main.temp_min - 273.15).toFixed(1),
            maxTemp: (weatherResponse.data.main.temp_max - 273.15).toFixed(1),
            airPressure: weatherResponse.data.main.pressure, //in hPA
            humidityInAir: weatherResponse.data.main.humidity, // in percentage
            rainAmount: weatherResponse.data.rain?.["1h"] || 0, //in mm in last 1 hour
            snowAmount: weatherResponse.data.snow?.["1h"] || 0, // mm in last 1 hour
            windSpeed: (weatherResponse.data.wind.speed * 3.6).toFixed(1),   // did m/s -> km/h
            windDegree: weatherResponse.data.wind.deg,
            gustSpeed: weatherResponse.data.wind.gust
                ? (weatherResponse.data.wind.gust * 3.6).toFixed(1) + " km/h" // Convert m/s -> km/h if gust exists
                : "N/A",   //  // If no gust data, show "N/A", bc it may be missing in some cities
            cloudCoverage: weatherResponse.data.clouds.all , //in percentage
            visibility: (weatherResponse.data.visibility / 1000).toFixed(1), // converted meters -> km
            //new Date(unix * 1000) → converts UNIX seconds to milliseconds (required by JS Date).
            //.toLocaleTimeString("en-IN", {hour12:true}) → makes it human-readable like “6:20 AM” or “7:10 PM”.
            sunriseTime: new Date(weatherResponse.data.sys.sunrise * 1000).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }),
            sunsetTime: new Date(weatherResponse.data.sys.sunset * 1000).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }),
        });
        console.log(`Icon = ${weatherResponse.data.weather[0].icon}, Temperature = ${(weatherResponse.data.main.temp - 273.15).toFixed(1)}°C , 
        Feels like = ${(weatherResponse.data.main.feels_like - 273.15).toFixed(1)}°C, 
        Air Pressure = ${weatherResponse.data.main.pressure + " hPa"}, Humidity = ${weatherResponse.data.main.humidity + " %"}, 
        Wind Speed = ${(weatherResponse.data.wind.speed * 3.6).toFixed(1) + " km/h"}, 
        Cloud Coverage = ${weatherResponse.data.clouds.all + " %"}, 
        Visibility = ${(weatherResponse.data.visibility / 1000).toFixed(1) + " km"}
         Sunrise Time = ${new Date(weatherResponse.data.sys.sunrise * 1000).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })}`);
        console.log(weatherResponse.data)

    } catch (error) {
        console.log("Error fetching coordinates or data: " + error.message);
        res.redirect("/");
    }
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.get("/signup", (req, res) => {
    res.render("sign-up.ejs");
})

app.listen(port, () => {
    console.log(`Server is currently running on port ${port}...`);
})