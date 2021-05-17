const baseAPIString = 'https://api.winnipegtransit.com/v3/';
const myAPIKey = 'Pwv2RRw9obTuNAXMOwK8';

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

getStreets('main')
.then((data) => {
  return getStops(data[0].key)
})
.then((data) => {
  console.log(data)
})
.catch(err => {
  console.log('Something went wrong:');
  console.log(err);
})
