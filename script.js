document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "1635890035cbba097fd5c26c8ea672a1"; 
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-btn');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const weatherContainer = document.getElementById('weather-container');
  
    const location = document.getElementById('location');
    const date = document.getElementById('date');
    const temperature = document.getElementById('temperature');
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const pressure = document.getElementById('pressure');
    const weatherIcon = document.getElementById('weather-icon');
  
    const formatDate = () => {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date().toLocaleDateString('en-US', options);
    };
  
    const showError = (message) => {
      errorMessage.textContent = message;
      errorContainer.classList.remove('hidden');
      weatherContainer.classList.add('hidden');
    };
  
    const clearError = () => {
      errorContainer.classList.add('hidden');
    };
  
    const displayWeatherData = (data) => {
      location.textContent = `${data.name}, ${data.sys.country}`;
      date.textContent = formatDate();
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
      weatherDescription.textContent = data.weather[0].description;
      feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
      humidity.textContent = `${data.main.humidity}%`;
      wind.textContent = `${data.wind.speed} m/s`;
      pressure.textContent = `${data.main.pressure} hPa`;
      weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
      weatherIcon.alt = data.weather[0].description;
      
      clearError();
      weatherContainer.classList.remove('hidden');
    };
  
    const fetchWeatherByCity = async (city) => {
      if (!city.trim()) {
        showError('Please enter a city name');
        return;
      }
  
      try {
        searchButton.disabled = true;
        searchButton.textContent = 'Loading...';
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        displayWeatherData(data);
      } catch (err) {
        showError(err.message);
      } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Search';
      }
    };
  
    const fetchWeatherByCoords = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch local weather');
        }
        
        const data = await response.json();
        displayWeatherData(data);
      } catch (err) {
        console.error('Error fetching local weather:', err);
      }
    };
  
    // Event listeners
    searchButton.addEventListener('click', () => {
      fetchWeatherByCity(cityInput.value);
    });
  
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        fetchWeatherByCity(cityInput.value);
      }
    });
  
    window.addEventListener('load', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
          },
          (err) => {
            console.error('Geolocation error:', err);
          }
        );
      }
    });
  });