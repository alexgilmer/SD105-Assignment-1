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
  const response = await fetch(`${baseAPIString}stops/${stopKey}/schedule.json?api-key=${myAPIKey}`);
  const data = await response.json();
  console.log(data['stop-schedule']['route-schedules']);
};

getStreets('main')
.then((streets) => {
  console.log(streets);
  return getStops(streets[0].key)
})
.then((stops) => {
  console.log(stops);
  getRouteData(stops[0].key);
})
.catch(err => {
  console.log('Something went wrong:');
  console.log(err);
})
