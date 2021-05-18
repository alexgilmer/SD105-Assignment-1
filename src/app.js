const baseAPIString = 'https://api.winnipegtransit.com/v3/';
const myAPIKey = 'Pwv2RRw9obTuNAXMOwK8';
const streetListElem = document.querySelector('section.streets');
const NUM_BUSES_PER_ROUTE = 2;

const dataObject = {
  stops: {
    10624: {
      street: 'Main Street',
      crossStreet: 'Assiniboine Avenue',
      direction: 'Northbound',
      routes: {
        55: ["2021-05-17T13:40:05", "second time"],
        68: ["2021-05-17T13:35:46", "second time"]
      }
    },
    10625: {
      street: 'Other Street',
      crossStreet: 'Some Boulevard',
      direction: 'Westbound',
      routes: {
        999: ["2021-05-17T23:59:59", "second time"]
      }
    }
  }
};

const wipeDataObject = function() {
  dataObject.stops = {};
};

const getStreets = async function(string) {
  const response = await fetch(`${baseAPIString}streets.json?api-key=${myAPIKey}&name=${string}`);
  const data = await response.json();
  return data.streets;
};

const getStops = async function(streetKey) {
  const response = await fetch(`${baseAPIString}stops.json?api-key=${myAPIKey}&street=${streetKey}`);
  const data = await response.json();
  return data.stops;
};

const getRouteData = async function(stopKey) {
  const response = await fetch(`${baseAPIString}stops/${stopKey}/schedule.json?api-key=${myAPIKey}&max-results-per-route=${NUM_BUSES_PER_ROUTE}`);
  const data = await response.json();
  return data['stop-schedule']['route-schedules'];
};

const getStreetLink = function(street) {
  return `<a href="#" data-street-key="${street.key}">${street.name}</a>`;
};

const populateStreetList = function(streets) {
  streetListElem.innerHTML = '';
  for (let street of streets) {
    streetListElem.innerHTML += getStreetLink(street);
  }
};

const buildDataObject = async function() {
  for (let stop in dataObject.stops) {
    const routes = await getRouteData(stop);
    for (let route of routes) {
      const routeKey = route.route.key;
      dataObject.stops[stop].routes[routeKey] = [];
      for (let i = 0; i < NUM_BUSES_PER_ROUTE; i++) {
        // This if statement prevents errors where
        // the number of buses available from the
        // api doesn't match the number of buses
        // we want to display. 
        if (route["scheduled-stops"][i].times.arrival.scheduled) {
          dataObject.stops[stop].routes[routeKey].push(route["scheduled-stops"][i].times.arrival.scheduled);
        }
      }
    }
  }

  return dataObject;
};

const createBusListing = function(dataObject) {
  const tbodyElem = document.querySelector('tbody');
  tbodyElem.innerHTML = '';

  for (let stop in dataObject.stops) {
    for (let route in dataObject.stops[stop].routes) {
      for (let busTime of dataObject.stops[stop].routes[route]) {
        const appointment = (new Date(busTime)).toLocaleTimeString('en-US', {hour:"numeric", minute:"numeric"});
        
        tbodyElem.innerHTML += `
        <tr>
          <td>${dataObject.stops[stop].street}</td>
          <td>${dataObject.stops[stop].crossStreet}</td>
          <td>${dataObject.stops[stop].direction}</td>
          <td>${route}</td>
          <td>${appointment}</td>
        </tr>`;
      }
    }
  }
};

const populateBusStops = function(streetKey) {
  wipeDataObject();

  getStops(streetKey)
  .then((stopList) => {
    for (let stop of stopList) {
      dataObject.stops[stop.key] = {
        street: stop.street.name,
        crossStreet: stop['cross-street'].name,
        direction: stop.direction,
        routes: {}
      };
    }
    buildDataObject()
    .then((dataObject) => {
      createBusListing(dataObject);
    })
    .catch((err) => {
      console.log('Something is broken:');
      console.log(err);
    });
  })
  .catch((err) => {
    console.log('Something is broken:');
    console.log(err);
  });
};

document.forms[0].addEventListener('submit', (e) => {
  e.preventDefault();
  const searchString = e.target[0].value;
  if (searchString) {
    e.target[0].value = '';
    getStreets(searchString)
    .then((streets) => {
      populateStreetList(streets);
    })
    .catch((err) => {
      console.log('Something went wrong:');
      console.log(err);
    });
  }
});

streetListElem.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    const streetKey = e.target.dataset.streetKey;
    populateBusStops(streetKey);
  }
});
