var request = require('request');

var app_id = "5b9d92ce";
var app_key = "05ffb3a53c5ddaece7551e85e65088c1";

	var headers = {
		'X-Yummly-App-ID' : app_id,
		'X-Yummly-App-Key' : app_key,
		'Content-Type' : 'application/json'
	}


	var options = {
		method: 'GET',
		headers: headers
	}

function getRecipeById(rid, callback){
	options.uri =  'http://api.yummly.com/v1/api/recipe/' + rid;

	request(options, function(error, response, body){
		if (!error && response.statusCode == 200) {
			callback(error, JSON.parse(body));
		}
		else callback(error, response);
	});
}

function search(query, callback){
	options.uri =  'http://api.yummly.com/v1/api/recipes';

	var queryoptions = options;
	queryoptions.useQuerystring = true;
	queryoptions.qs = query;
	request(queryoptions, function(error, response, body){
		if (!error && response.statusCode == 200) {
			callback(error, JSON.parse(body).matches);
		}
		else callback(error);
	});
}

exports.getRecipeById = getRecipeById;
exports.search = search;
