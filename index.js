var db = require('./lib/dbfunctions');
var ym = require('./lib/yumfunctions');

function getRecipeById(rid, callback){
	if(isNaN(rid) && rid !== undefined){
		ym.getRecipeById(rid, function(err, result){
			if(err){
				callback("Problem with Yummly!", result);
				return console.error("error", err);
			}
			callback(err, result);			
		});
	}
	else{
		db.getRecipeById(rid, function(err, result){
			if(err){
				callback(err);
			}
			else{
				callback(err, result);
			}
		});
	}
}

function dbsearch(query, callback){
	db.search(query,callback);
};

function search(query, callback){

	for(var i in query.flavor){
			if(i.min === 0){
				delete i.min;
			}
			if(i.max === 1){
				delete i.max;
			}

		}		
	/*
		set search size defaults, if not set
	*/
	if(! query.maxResult) query.maxResult = 6;
	query.tempMaxResult = query.maxResult;
	if(! query.start) query.start = 0;
	if(! query.dbstart) query.dbstart = query.start;
 
	if(query.q) query.recipeName = query.q; //this is to fix my yummly name blunder.

	db.search(query, function(err1, result1){

		if(!err1){
			/*
			   check if our database call has filled an entire page of results
			   if it has, adjust the db search starting point
			   and return these results. we have enough, don't need to query yummly yet.
			*/
			if((query.dbstart + result1.length) >= (query.dbstart + query.maxResult )){
				callback(err1, result1, query);
				return;	
			}
			/* check that the results didn't fill an entire page
			   adjust maxresults remporarily
			   this should alwyas return true, else the db is returning too many resuts
			*/
			else if( (query.dbstart + result1.length) < (query.dbstart + query.maxResult)){
				//nothing actually needs to happen here after all. It'll pass down to ym search below
			}else{
				err1 = "db returned too many results. This shoud not happen";
			}
		}
		/* If database has partially filled a page, or has no results,
		   Continue with a yummly query on the remaining length of the page
		   do this by setting the maxresult to the remining number to query.
		   we'll change maxresult back later
		*/
		if(!err1 && (query.start + result1.length)<(query.start + query.maxResult)){
			query.maxResult -= result1.length;
		}

		ym.search(query, function(err2, result2){
			/*
				set the maxresult back to the normal amount
			*/
			query.nextstart = query.start + query.maxResult;
			query.maxResult = query.tempMaxResult;
			delete query.tempMaxResult;


			if(err2 && err1){
				callback("Yummly and Internal DB error");
				console.error("db error", err1);
				 return console.error("yummly error", err2);
			}
			if(err1){
				callback(err2, result2, query);
				return console.error("database error", err1);
			}
			if(err2){
				callback(err1, result1, query);
				return console.error("yummly error", err2);
			}
			
			/*
				adjust yummly start for next query, based on the database results offset.
				reset maxResult to query input.
			*/
			//no errors. merge results
			callback(err1, result1.concat( result2 ), query);
			//callback( result1 );
		});
	});
}

exports.getUserById = db.getUserById;
exports.addUser = db.addUser;
exports.addRecipe = db.addRecipe;
exports.getByIngredients = db.getByIngredients;
exports.printAllRecipes = db.printAllRecipes;
exports.printAllUsers = db.printAllUsers;
exports.getRecipesByQuery = db.getRecipesByQuery;
exports.getRecipesByUser = db.getRecipesByUser;
exports.login = db.login;
exports.addBlogEntry = db.addBlogEntry;
exports.getUserBlogById = db.getUserBlog;
exports.getBlogEntryById = db.getBlogEntry;
exports.deleteBlogEntryById = db.deleteBlogEntry;
exports.deleteUserBlogById = db.deleteUserBlog;
exports.editBlogEntry = db.editBlogEntry;
exports.editUser = db.editUser;
exports.editRecipe = db.editRecipe;
exports.getRecipeById = getRecipeById;
exports.search = search;
exports.dbsearch = dbsearch;
