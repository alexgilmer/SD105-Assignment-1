const myAPIKey = 'Pwv2RRw9obTuNAXMOwK8';

const getStreets = async function(string) {
  const response = await fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${myAPIKey}&name=${string}`)
  const data = await response.json();
  return data.streets;
};


getStreets('main').then(data => console.log(data));

