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
var baseurl = 'api.openweathermap.org/data/2.5/weather?';
function Openweather (apiKey ) {
    this.apiKey = apiKey;
}
/*
Issue a search query to openweather database.
@param {string} coord: Search by coordinates
coord = 'lat=35.772096&lon=-78.638614'
*/
Openweather.prototype.search = function(coord) {
  var resultJson = http().get(baseurl + encodeURIComponent(coord) + "&appid=" + this.apiKey );
  var res = JSON.parse(resultJson.body);
  var result = {};
  if (res.data.id !== undefined)
      result['id'] = res.data.id;
  if (res.data.name !== undefined)
      result['location'] = res.data["name"];
  if (res.data.weather !== undefined) {
      result['conditions'] = res.data.weather["main"];
      result['detail'] = res.data.weather["description"];
      result['icon'] = "http://openweathermap.org/img/w/" + res.data.weather["icon"] + ".png";
  }
  if (res.data.main !== undefined) {
      result['temperature'] = res.data.main["temp"];
      result['humidity'] = res.data.main["humidity"];
      result['pressure'] = res.data.main["pressure"];
  }
  if (res.data.wind !== undefined)
      result['windspeed'] = res.data.wind["speed"];
  if (res.data.clouds !== undefined)
      result['clouds'] = res.data.clouds["all"];
  if (res.data.rain !== undefined)
      result['rain'] = res.data.rain["3h"];
  if (res.data.sys !== undefined) {
      result['sunrise'] = res.data.sys['sunrise'];
      result['sunset'] = res.data.sys['sunset'];
  }
  return result;
}
