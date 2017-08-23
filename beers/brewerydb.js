/*
Library for a custom data source for Memento DataBase
to obtaining information from the api at brewerydb.com.
See http://www.brewerydb.com/developers/docs.
@param {string} apiKey -- api key.
@param {string} type   -- Type of search, one of
    brewery
    beer
    guild
    event
Leave blank to search all sources
Api key can be obtained from: 
http://www.brewerydb.com/developers/
@example
var brewery = new Brewery("Api key" , "beer" );
var r = brewery.search(query);
result( r , function(id) { return brewery.extra(id);});

Follows example at
https://github.com/mementodatabase/scripts/blob/master/data-sources/discogs.js
*/
var baseurl = 'https://api.brewerydb.com/v2/';
function Brewery (apiKey , type) {
    this.apiKey = apiKey;
    this.type = type;
}
/*
Issue a search query to Brewery database.
@param {string} query - Search query.
*/
Brewery.prototype.search = function(query) {
  var result = http().get(baseurl + "search?q=" + encodeURIComponent(query) + "&key=" + this.apiKey + "&type=" + this.type);
  var json = JSON.parse(result.body);
  return json.data;
}
/*
Issue a search query to Brewery database.
@param {string} code - Search geopoint.
coord = 'lat=35.772096&lng=-78.638614'
*/
Brewery.prototype.geo = function(coord) {
  var result = http().get(baseurl + "search/geo/point?" + encodeURIComponent(coord) + "&key=" + this.apiKey + "&type=" + this.type);
  var json = JSON.parse(result.body);
  return json.data;
}
/*
Issue a search query to Brewery database.
@param {string} code - Search beer styles.
*/
Brewery.prototype.style = function(style) {
  var result = http().get(baseurl + "search/style?q=" + encodeURIComponent(style) + "&key=" + this.apiKey + "&type=" + this.type);
  var json = JSON.parse(result.body);
  return json.data;
}
/*
Function to retrieve full record by id
@param {string} id - The resource identifier.
*/
Brewery.prototype.extra = function(id) {
    var resultJson = http().get(baseurl + this.type + "/" + id + "/" + "?key=" + this.apiKey );
    var res = JSON.parse(resultJson.body);
    var result = {};
    if (res.data.id !== undefined)
        result['id'] = res.data.id ;
    if (res.data.name !== undefined)
        result['name'] = res.data.name;
    if (res.data.abv !== undefined)
        result['abv'] = res.data.abv;
    if (res.data.ibu !== undefined)
        result['ibu'] = res.data.ibu;
    if (res.data.style !== undefined)
        result['style'] = res.data.style['name'] + ".\n" + res.data.style['description'];
    if (res.data.glass !== undefined)
        result['glass'] = res.data.glass['name'];
    if (res.data.labels !== undefined) {
        result['labels'] = res.data.labels['medium'];
        result['icon'] = res.data.labels['icon;'];
    }
    if (res.data.foodPairings !== undefined)
        result['foodPairings'] = res.data.foodPairings;
    if (res.data.description !== undefined)
        result['description'] = res.data.description;
    if (res.data.available !== undefined)
        result['available'] = res.data.available['name'] + ".\n" + res.data.available['description'];
    return result;
}