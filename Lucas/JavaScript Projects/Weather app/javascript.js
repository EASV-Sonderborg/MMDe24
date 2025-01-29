const apiKey = "bc2505d602eb97adc888acdb2c24cf3d";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

        const searchBox = document.querySelector(".search input");
        const searchBtn = document.querySelector(".search button");
        const weather__icon = document.querySelector(".weather__icon");

        async function checkWeather(city){
            const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

            if(response.status == 404){
                document.querySelector(".error").style.display = "block";
                document.querySelector(".weather").style.display = "none";
            }
            else{
                var data = await response.json();

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity +"%";
            document.querySelector(".wind").innerHTML = data.wind.speed +" km/h";

            if(data.weather[0] .main == "Clouds"){
                weather__icon.src = "images/Clouds.png"
            }

            else if (data.weather[0] .main == "Clear"){
                weather__icon.src = "images/Clear.png"
            }

            else if (data.weather[0] .main == "Rain"){
                weather__icon.src = "images/rain.png"
            }

            else if (data.weather[0] .main == "Drizzle"){
                weather__icon.src = "images/drizzle.png"
            }

            else if (data.weather[0] .main == "Mist"){
                weather__icon.src = "images/mist.png"
            }

            else if (data.weather[0] .main == "Snow"){
                weather__icon.src = "images/snow.png"
            }

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
            }

            var data = await response.json();

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity +"%";
            document.querySelector(".wind").innerHTML = data.wind.speed +" km/h";

            if(data.weather[0] .main == "Clouds"){
                weather__icon.src = "images/Clouds.png"
            }

            else if (data.weather[0] .main == "Clear"){
                weather__icon.src = "images/Clear.png"
            }

            else if (data.weather[0] .main == "Rain"){
                weather__icon.src = "images/rain.png"
            }

            else if (data.weather[0] .main == "Drizzle"){
                weather__icon.src = "images/drizzle.png"
            }

            else if (data.weather[0] .main == "Mist"){
                weather__icon.src = "images/mist.png"
            }

            else if (data.weather[0] .main == "Snow"){
                weather__icon.src = "images/snow.png"
            }

            document.querySelector(".weather").style.display = "block";

        }

        searchBtn.addEventListener("click", ()=>{
            checkWeather(searchBox.value);
        })

        searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

        checkWeather();