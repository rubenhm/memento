/*
Library for a custom data source for Memento DataBase
to obtaining information from the api at https://openweathermap.org.
See https://openweathermap.org/api.
@param {string} apiKey -- api key.

@example
var openweather = new Openweather("Api key" );
var r = openweather.search(query);
result( r , function(id) { return openweather.extra(id);});

Follows example at
https://github.com/mementodatabase/scripts/blob/master/data-sources/discogs.js
*/
var baseurl = 'http://api.openweathermap.org/data/2.5/weather?';
function Openweather (apiKey ) {
    this.apiKey = apiKey;
}
/*
Issue a search query to openweather database.
@param {string} coord: Search by coordinates
coord = 'lat=35.772096&lon=-78.638614'
*/
Openweather.prototype.search = function(coord) {
  var resultJson = http().get(baseurl + coord + "&appid=" + this.apiKey );
  var res = JSON.parse(resultJson.body);
  var result = {};
  if (res.id !== undefined)
      result['id'] = res['id'];
  if (res.name !== undefined)
      result['location'] = res['name'];
  if (res.weather !== undefined) {
      result['conditions'] = res.weather[0]['main'];
      result['detail'] = res.weather[0]['description'];
      result['icon'] = "http://openweathermap.org/img/w/" + res.weather[0]['icon'] + ".png";
  };
  if (res.main !== undefined) {
      result['temperature'] = res.main['temp'];
      result['humidity'] = res.main['humidity'];
      result['pressure'] = res.main['pressure'];
  };
  if (res.wind !== undefined)
      result['windspeed'] = res.wind['speed'];
  if (res.clouds !== undefined)
      result['clouds'] = res.clouds['all'];
  if (res.rain !== undefined) {
      result['rain'] = res.rain['3h'];
} else {
      result['rain'] = "No rain";
}
  if (res.sys !== undefined) {
      result['sunrise'] = res.sys['sunrise'];
      result['sunset'] = res.sys['sunset'];
  };
  return result;
}
