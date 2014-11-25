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

function search(query, callback){

	
	db.search(query, function(err1, result1){
		
		for(var i in query.flavor){
			if(i.min === 0){
				delete i.min;
			}
			if(i.max === 1){
				delete i.max;
			}

		}

		ym.search(query, function(err2, result2){
			if(err2 && err1){
				callback("Yummly and Internal DB error");
					console.error("db error", err1);
				 return console.error("yummly error", err2);
			}
			if(err1){
				callback(err2, result2);
				return console.error("database error", err1);
			}
			if(err2){
				callback(err1, result1);
				return console.error("yummly error", err2);
			}
			//no errors. merge results
			callback(err1, result1.concat( result2 ));
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
