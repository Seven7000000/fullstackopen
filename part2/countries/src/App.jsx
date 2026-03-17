import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (capital && api_key) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(() => {
          setWeather(null)
        })
    }
  }, [capital, api_key])

  if (!api_key) {
    return <p>Set VITE_WEATHER_API_KEY env variable to see weather data</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital?.[0]}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="150"
      />
      {country.capital?.[0] && <Weather capital={country.capital[0]} />}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const filtered = search
    ? countries.filter(c =>
        c.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const countryToShow = selectedCountry
    ? selectedCountry
    : filtered.length === 1
      ? filtered[0]
      : null

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      {search === '' ? null
        : filtered.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countryToShow ? (
          <CountryDetail country={countryToShow} />
        ) : (
          <div>
            {filtered.map(country => (
              <div key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => setSelectedCountry(country)}>
                  show
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default App
