const baseAPIString = 'https://api.winnipegtransit.com/v3/';
const myAPIKey = 'Pwv2RRw9obTuNAXMOwK8';
const streetListElem = document.querySelector('section.streets');
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

const wipeData = function() {
  dataObject.stops = {};
};

const getStreets = async function(string) {
  const response = await fetch(`${baseAPIString}streets.json?api-key=${myAPIKey}&name=${string}`)
  const data = await response.json();
  return data.streets;
};

const getStops = async function(streetKey) {
  const response = await fetch(`${baseAPIString}stops.json?api-key=${myAPIKey}&street=${streetKey}`);
  const data = await response.json();
  return data.stops;
};

const getRouteData = async function(stopKey) {
  const response = await fetch(`${baseAPIString}stops/${stopKey}/schedule.json?api-key=${myAPIKey}&max-results-per-route=2`);
  const data = await response.json();
  return data['stop-schedule']['route-schedules'];
};

const getStreetLink = function(street) {
  return `<a href="#" data-street-key="${street.key}">${street.name}</a>`;
}

const populateStreetList = function(streets) {
  streetListElem.innerHTML = '';
  for (let street of streets) {
    streetListElem.innerHTML += getStreetLink(street);
  }
};

const buildDataObject = async function() {
  for (let stop in dataObject.stops) {
    const routes = await getRouteData(stop)
    for (let route of routes) {
      dataObject.stops[stop].routes[route.route.key] = [];
      for (let i = 0; i < 2; i++) {
        if (route["scheduled-stops"][i].times.arrival.scheduled) {
          dataObject.stops[stop].routes[route.route.key].push(route["scheduled-stops"][i].times.arrival.scheduled);
        }
      }
    }
  }

  return dataObject;
};

const populateBusStops = function(streetKey) {
  // wipe object data
  // get all the stops
  // put data into object
  // for each stop, get all routes
  // put data into object
  // populate page

  wipeData();

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
      console.log(dataObject);
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

  const tbodyElem = document.querySelector('tbody');
  tbodyElem.innerHTML = '';
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