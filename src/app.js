const baseAPIString = 'https://api.winnipegtransit.com/v3/';
const myAPIKey = 'Pwv2RRw9obTuNAXMOwK8';
const dataObject = {
  street: 'Main Street',
  stops: {
    10624: {
      crossStreet: 'Assiniboine Avenue',
      direction: 'Northbound',
      routes: {
        55: "2021-05-17T13:40:05",
        68: "2021-05-17T13:35:46"
      }
    },
    10625: {
      crossStreet: 'Some Boulevard',
      direction: 'Westbound',
      routes: {
        999: "2021-05-17T23:59:59"
      }
    }
  }
};

const wipeData = function() {
  dataObject.street = '';
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
  console.log(data['stop-schedule']['route-schedules']);
};

const getStreetLink = function(street) {
  return `<a href="#" data-street-key="${street.key}">${street.name}</a>`;
}

const populateStreetList = function(streets) {
  const streetListElem = document.querySelector('section.streets');
  streetListElem.innerHTML = '';
  for (let street of streets) {
    streetListElem.innerHTML += getStreetLink(street);
  }
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
