function el(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatTemperature(value) {
  return `${Math.round(value)}°`;
}

function fromUnix(seconds) {
  return new Date(seconds * 1000);
}

function formatTime(date) {
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
  return date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
}

function renderSunTime(label, seconds) {
  const item = el('span', 'sun-item');
  item.append(el('span', 'sun-label', label), el('span', 'sun-time', formatTime(fromUnix(seconds))));
  return item;
}

function renderCurrent(data) {
  const [weather] = data.weather;
  const at = fromUnix(data.dt);

  document.getElementById('location-name').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('location-date').textContent = `${formatDate(at)}, ${formatTime(at)}`;
  document.getElementById('current-temperature').textContent = formatTemperature(data.main.temp);
  document.getElementById('current-condition').textContent = weather.description;

  const details = [
    ['odczuwalna', formatTemperature(data.main.feels_like)],
    ['wilgotność', `${data.main.humidity}%`],
    ['wiatr', `${data.wind.speed.toLocaleString('pl-PL')} m/s`],
    ['ciśnienie', `${data.main.pressure} hPa`],
  ];

  document.getElementById('current-details').replaceChildren(
    ...details.map(([label, value]) => {
      const row = el('div', 'detail');
      row.append(el('dt', 'detail-label', label), el('dd', 'detail-value', value));
      return row;
    }),
  );

  document.getElementById('current-sun').replaceChildren(
    renderSunTime('wschód', data.sys.sunrise),
    renderSunTime('zachód', data.sys.sunset),
  );
}

function groupByDay(list) {
  const days = new Map();

  list.forEach((item) => {
    const key = fromUnix(item.dt).toDateString();
    if (!days.has(key)) days.set(key, []);
    days.get(key).push(item);
  });

  return [...days.values()];
}

function relativeDayLabel(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === new Date().toDateString()) return 'dziś';
  if (date.toDateString() === tomorrow.toDateString()) return 'jutro';
  return '';
}

function renderForecastSlot(item) {
  const [weather] = item.weather;
  const slot = el('div', 'slot');
  const info = el('div', 'slot-info');

  info.append(
    el('span', 'slot-description', weather.description),
    el('span', 'slot-feels', `odczuwalna ${formatTemperature(item.main.feels_like)}`),
  );

  slot.append(
    el('span', 'slot-time', formatTime(fromUnix(item.dt))),
    info,
    el('span', 'slot-temp', formatTemperature(item.main.temp)),
  );

  return slot;
}

function renderForecast(forecast) {
  document.getElementById('forecast-list').replaceChildren(
    ...groupByDay(forecast.list).map((items) => {
      const date = fromUnix(items[0].dt);
      const day = el('article', 'forecast-day');
      const title = el('h3', 'day-title');
      const slots = el('div', 'slots');

      title.append(el('span', 'day-date', formatDate(date)), el('span', 'day-relative', relativeDayLabel(date)));
      slots.append(...items.map(renderForecastSlot));
      day.append(title, slots);

      return day;
    }),
  );
}


const API_KEY = '7ded80d91f2b280ec979100cc8bbba94';
const API_URL = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('search-form');
const addressInput = document.getElementById('address');
const searchButton = document.getElementById('search-button');
const statusMessage = document.getElementById('status');

function buildApiUrl(endpoint, address) {
  const params = new URLSearchParams({ q: address, appid: API_KEY, units: 'metric', lang: 'pl' });
  return `${API_URL}/${endpoint}?${params}`;
}

function apiErrorMessage(status) {
  if (status === 404) return 'Nie znaleziono takiej miejscowości.';
  if (status === 401) return 'Nieprawidłowy lub nieaktywny klucz API.';
  return `Serwer pogody zwrócił błąd ${status}.`;
}

function getCurrentWeather(address) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', buildApiUrl('weather', address), true);

    req.addEventListener('load', () => {
      if (req.status !== 200) {
        reject(new Error(apiErrorMessage(req.status)));
        return;
      }

      const data = JSON.parse(req.responseText);
      console.log('Current Weather (XMLHttpRequest):', data);
      resolve(data);
    });

    req.addEventListener('error', () => {
      reject(new Error('Brak połączenia z serwerem pogody.'));
    });

    req.send(null);
  });
}

async function getForecast(address) {
  let response;

  try {
    response = await fetch(buildApiUrl('forecast', address));
  } catch {
    throw new Error('Brak połączenia z serwerem pogody.');
  }

  if (!response.ok) {
    throw new Error(apiErrorMessage(response.status));
  }

  const data = await response.json();
  console.log('5 day forecast (Fetch API):', data);
  return data;
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const address = addressInput.value.trim();

  if (!address) {
    statusMessage.textContent = 'Wpisz adres lub miejscowość.';
    return;
  }

  searchButton.disabled = true;
  statusMessage.textContent = 'Pobieranie pogody…';

  try {
    const [current, forecast] = await Promise.all([getCurrentWeather(address), getForecast(address)]);

    renderCurrent(current);
    renderForecast(forecast);
    statusMessage.textContent = '';
  } catch (error) {
    statusMessage.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
});
