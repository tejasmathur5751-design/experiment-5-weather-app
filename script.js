const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');

function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    weatherResult.style.display = 'block';
    weatherResult.textContent = 'Loading...';

    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=en&format=json')
        .then(function (res) {
            return res.json();
        })
        .then(function (geoData) {
            if (!geoData.results || geoData.results.length === 0) {
                weatherResult.textContent = 'City not found.';
                return;
            }

            const loc = geoData.results[0];
            const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.latitude + '&longitude=' + loc.longitude + '&current=temperature_2m,wind_speed_10m';

            return fetch(url)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    weatherResult.innerHTML = '<h3>' + loc.name + '</h3>' +
                        '<p>Temperature: ' + data.current.temperature_2m + ' °C</p>' +
                        '<p>Wind Speed: ' + data.current.wind_speed_10m + ' km/h</p>';
                });
        })
        .catch(function () {
            weatherResult.textContent = 'Error fetching weather data.';
        });
}

searchBtn.onclick = fetchWeather;

cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        fetchWeather();
    }
});
