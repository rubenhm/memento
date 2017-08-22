/*
The data source for obtaining information from brewerydb.com.
See http://www.brewerydb.com/developers/docs
@param {string} apiKey - Consumer key.
@param {string} type - Type of search, one of 
    brewery
    beer
    guild
    event
Leave blank to search all sources
Api key can be obtained by this link : http://www.brewerydb.com/developers/
@example 
var brewery = new Brewery("Api key" , "beer" );
var r = brewery.search(query);
result( r , function(id) { return brewery.extra(id);});
*/

var baseurl = 'https://api.brewerydb.com/v2/'

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
  return json.results;  

}

/*
Issue a search query to Brewery database.
@param {string} code - Search geopoint.
This a premium endpoint
*/
Brewery.prototype.geo = function(coord) {
  var result = http().get(baseurl + "search/geo/point?" + encodeURIComponent(coord) + "&key=" + this.apiKey + "&type=" + this.type);
  var json = JSON.parse(result.body);
  return json.results;    
}

/*
Issue a search query to Brewery database.
@param {string} code - Search beer styles.
*/

Brewery.prototype.style = function(style) {
  var result = http().get(baseurl + "search/style?q=" + encodeURIComponent(style) + "&key=" + this.apiKey + "&type=" + this.type);
  var json = JSON.parse(result.body);
  return json.results;  
}


/*
@param {string} id - The resource identifier.
*/
Brewery.prototype.extra = function(id) {
    var resultJson = http().get(baseurl + this.type + "/" + id + "/" + "?key=" + this.apiKey );
    var result = JSON.parse(resultJson.body); 
    if (result.id !== undefined) 
        result['id'] = result.data.id ;
    if (result.name !== undefined) 
        result['name'] = result.data.name;
    if (result.abv !== undefined)
        result['abv'] = result.data.abv;
    if (result.ibu !== undefined)  
        result['ibu'] = result.data.ibu;
    if (result.style !== undefined) 
        result['style'] = result.data.style['id'] + ";" + result.data.style['name'] + ". " + result.data.style['description'];
    if (result.glass !== undefined) 
        result['glass'] = result.data.glass['id'] + "; " + result.data.glass['name'];
    if (result.labels !== undefined)
        result['labels'] = result.data.labels['medium'];
    if (result.foodPairings !== undefined) 
        result['foodPairings'] = result.data.foodPairings;
    if (result.description !== undefined) 
        result['description'] = result.data.description;
    if (result.available !== undefined) 
        result['available'] = result.data.available['name'] + ": " + result.data.available['description'];
    return result;
}