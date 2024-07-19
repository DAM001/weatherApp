document.addEventListener('DOMContentLoaded', function() {
    // Get weather for entered city
    document.getElementById('getWeather').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const url = `./server/weather.php?city=${city}`;
        loadData(url);
    });

    // Get weather for user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `./server/weather.php?lat=${lat}&lon=${lon}`;
            loadData(url);
        });
    } else {
        document.getElementById('weatherInfo').innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    }
});

function loadData(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data) {
            console.log(data);

            // Main weather info
            const currentTime = new Date().getHours();
            const sunriseTime = convertTo24Hour(data.forecast.forecastday[0].astro.sunrise);
            const sunsetTime = convertTo24Hour(data.forecast.forecastday[0].astro.sunset);
            const isCurrentDay = currentTime > sunriseTime && currentTime < sunsetTime;

            const weatherInfo = `
                <h2>${data.location.name}</h2>
                <p class="temperature gradient-text">${data.current.temp_c} °C</p>
                <p>Humidity: ${data.current.humidity} %</p>
                <p>Wind Speed: ${data.current.wind_kph} kph</p>
                <p>Weather: ${data.current.condition.text}</p>
            `;
            document.getElementById('mainWeatherInfo').querySelector('.weather-info').innerHTML = weatherInfo;
            document.getElementById('mainWeatherInfo').querySelector("img").src = "./assets/" + getWeatherIcon(data.current.condition.code, isCurrentDay);

            // Extra weather info
            const extraWeatherInfoContainer = document.getElementById('extraWeatherInfo');
            extraWeatherInfoContainer.querySelector('.sunrise').querySelector('p').innerHTML = data.forecast.forecastday[0].astro.sunrise;
            extraWeatherInfoContainer.querySelector('.sunset').querySelector('p').innerHTML = data.forecast.forecastday[0].astro.sunset;

            // Hourly
            const weatherHourly = document.getElementById("weatherHourly");
            weatherHourly.innerHTML = "";

            for (let i = 0; i < 3; i++) {
                let currentHour = new Date().getHours();
                const hourlyData = data.forecast.forecastday[i].hour;
                const sunriseTime = convertTo24Hour(data.forecast.forecastday[i].astro.sunrise);
                const sunsetTime = convertTo24Hour(data.forecast.forecastday[i].astro.sunset);

                let innerHTML = "<div class='hour-day-container'>";
                if (i == 0) innerHTML += "<h2>Today:</h2>";
                if (i == 1) innerHTML += "<h2>Tomorrow:</h2>";
                if (i == 2) innerHTML += "<h2>After tomorrow:</h2>";

                for (let j = 0; j < hourlyData.length; j++) {
                    if (i === 0 && j < currentHour) continue; // Skip past hours of today
                    const isHourDay = j > sunriseTime && j < sunsetTime;

                    const weatherInfoHour = `
                        <div class="hour-info">
                            <p class="hour-display">${j}:00</p>
                            <img class="icon" src="./assets/${getWeatherIcon(hourlyData[j].condition.code, isHourDay)}" alt="">
                            
                            <div>
                                <p class="temperature gradient-text">${hourlyData[j].temp_c} °C</p>
                                <img class="wind" src="./assets/wind.png" alt="">
                                <p class="wind-text"> ${hourlyData[j].wind_kph} kph</p>
                            </div>
                        </div>
                    `;
                    innerHTML += weatherInfoHour;
                }

                innerHTML += "</div>";
                weatherHourly.innerHTML += innerHTML;
            }

        } else {
            document.getElementById('weatherInfo').innerHTML = `<p>No data available</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('weatherInfo').innerHTML = `<p>Error fetching data</p>`;
    });
}

function convertTo24Hour(time) {
    const [hour, minutePart] = time.split(':');
    const period = minutePart.slice(-2);
    let hour24 = parseInt(hour, 10);

    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;

    console.log(hour24);
    return hour24;
}