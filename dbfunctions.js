var pg = require('pg');
var conString;
if(process.env.USER === 'cinnamoncrickets'){
	conString = 'postgres://cinnamoncrickets:cookups.org@localhost/cookupsdb';
}
else{
	conString = 'postgres://'+process.env.USER+':cookups.org@localhost/cookupsdb';
}

/*
 * args: addUser( newuser, callback(error, result) );
 *
	Needs: User Exists In System
 *
 */

function login(user, callback){

	var stmtArr = [user.email]; 
	var stmt = "SELECT uid, email, uname, password, picture FROM users WHERE email = $1";
	stmt += ";";
console.log(stmt);

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err', err);
		}
		client.query(stmt, stmtArr, function(err, results){
			done();
			if(err){
				callback("Internal Database Error");
				return console.error('err', err);
			}
			if(! results.rows[0]) {
				var errmsg = "User not in database";
				callback(errmsg);
			}
			else if(results.rows[0].password === user.password){
				var success = results.rows[0];
				delete success.password;
				callback(err, success );
			}
			else{
				var errmsg = "Incorrect Password";
				callback(errmsg);
			}
			//done();
		});
	});
	pg.end();
}

function addUser(newuser, callback){
	var error = null;
	if( newuser.uname === null || newuser.uname === "")		error = "name can't be empty";
	else if(newuser.uname.length > 20 ) 	error = "name max size of 20";
	else if(newuser.password === null || newuser.password === "")	error = "password can't be empty";
	else if(newuser.password.length > 25)	error = "password max size of 25";
	else if (newuser.email === null)	error = "email can't be empty";
	else if (newuser.email.length > 40 ) 	error = "email max size of 40";
	if (error){
		callback(error);
		return;
	}

	var stmtArr = [newuser.uname, newuser.email, newuser.password];

	var stmt = "INSERT into USERS values(DEFAULT,$1,$2,$3";
	if(newuser.bio) { stmt += ",$4"; stmtArr.push(newuser.bio); }
 	if(newuser.picture) { stmt += ",$5"; stmtArr.push(newuser.picture); }
	stmt += ") RETURNING uid;";
console.log(stmt);
		pg.connect(conString,function(err, client, done){
//		pg.connect(conString, function(err, client, done){
		if(err){
			console.log(err);
			console.log("---------------");
			callback(err, error);
			return console.error('err', err);
		}	
		client.query(stmt, stmtArr, function(err, results){
			done();
			var returnUser = newuser;
			delete returnUser.password;
			returnUser.uid = results.rows[0].uid;
			callback(err, returnUser);
		});
	});
	pg.end();
}

function getRecipesByUser(query, callback){
	
	var stmt = "SELECT R.name FROM recipes R where ";
}

function getRecipesByQuery(query, callback){
	var error = null;
	var stmt = "SELECT name FROM recipes WHERE ingredients @> '{";
	for(var i = 0; i < query.ingredients.length; i++){
		if(i === query.ingredients.length-1) stmt += query.ingredients[i];
		else stmt += query.ingredients[i] + ",";
	}
	stmt += "}'::text[];";

//	console.log("sql: " + stmt);	
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('err', err);
		}
		client.query(stmt, function(err, results){
			done();
			callback(err, results.rows);
		});
	});	
	pg.end();
}

function getByIngredients(query, callback){
	var error = null;
/*	var stmt = "SELECT name FROM recipes WHERE ingredients @> '{";
	for(var i = 0; i < query.ingredients.length; i++){
		if(i === query.ingredients.length-1) stmt += query.ingredients[i];
		else stmt += query.ingredients[i] + ",";
	}
	stmt += "}'::text[];";
*/
	var stmtArr = [];
	stmtArr.push(query.ingredients);
	var stmt = "SELECT * from recipes where true and ingredients @> $"+stmtArr.length+"::text[];";
		

//	console.log("sql: " + stmt);	
	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err', err);
		}
		client.query(stmt, stmtArr, function(err, results){
			done();
			callback(err, results.rows);
		});
	});	
	pg.end();
}

function printAllRecipes(callback){

	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('err', err);
		}
		client.query('select * from recipes;', function(err, result){
			done();
			if(result.rows[0]) callback(err, result.rows);
			else callback("Recipe Not Found");
		});

	});	
	pg.end();
}

function printAllUsers(callback){

	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('err', err);
		}
		client.query('select * from users;', function(err, result){
			done();
			callback(err, result.rows);
		});

	});	
	pg.end();
}

function getUserById(userId, callback){
	var stmtArr = [userId];

	var stmt = "SELECT U.uid, U.uname, U.bio, U.picture FROM users U where U.uid = $1;";
	
	pg.connect(conString, function(err, client, done){
		if(err) return;
		client.query(stmt, stmtArr, function(err, result){
			done();
			callback(err, result.rows);
		});
	});
	pg.end();
}


function editUser(user, callback){
	var stmtArr = [];
	
	var stmt = "UPDATE users SET ";
	if(user.uname) { stmtArr.push(user.uname) ; stmt += "uname = $" + stmtArr.length ; }
	if(user.email) {
		if(stmtArr.length > 0) { stmt += "," ; }
		stmtArr.push(user.email); stmt += "email = $" + stmtArr.length ;
	}
	if(user.password) {
		if(stmtArr.length > 0) { stmt += "," ; }
		stmtArr.push(user.password); stmt += "password = $" + stmtArr.length ;
	}
	if(user.bio) {
		if(stmtArr.length > 0) { stmt += "," ; }
		stmtArr.push(user.bio); stmt += "bio = $" + stmtArr.length ;
	}
	if(user.picture) {
		if(stmtArr.length > 0) { stmt += "," ; }
		stmtArr.push(user.picture); stmt += "picture = $" + stmtArr.length ;
	}
	stmtArr.push(user.uid);
	stmt += " WHERE uid = $"+ stmtArr.length;
	stmt += " RETURNING uid;";
	
	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}
		
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(err) callback("Internal Database Error");
			else if(result.rows[0]) callback(result.rows[0]);
			else callback("User not registered");
		});
	});
	pg.end();
}


function getRecipeById(rid, callback){

	var stmtArr = [rid];

	var stmt = "SELECT * FROM recipes WHERE rid = $1;";

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}
		
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(result.rows[0]) callback(err, result.rows[0]);
			else callback("Recipe Not Found");
		});
	});
	pg.end();
}



/*	example input object for addRecipe:

var recipeObject = 
	{
	uid:34,
	name:"pancakes",
	ingredients: ["milk","eggs","flour"],
	instructions: "Make some pancakes!",
	//remaining fields optional
	totaltime: 200
	servings: 5
	sweet: .5
	salty: .1
	bitter: .2
	meaty: .3
	calories: 10000000
	}

*/
function addRecipe(recipe, callback){
//	var stmtArr = [recipe.name, recipe.ingredients, recipe.instructions];
/*	
	var stmt = "INSERT into RECIPES values(DEFAULT,$1,$2,$3";
	if(recipe.totalTime) { stmtArr.push(recipe.totalTime); stmt += ",$"+ stmtArr.length; }
 	if(recipe.servings) { stmtArr.push(recipe.servings); stmt += ",$" + stmtArr.length; }
	stmt += ") RETURNING rid;";
*/

	if(! recipe.name) return callback("Must enter a recipe name");
	if(! recipe.ingredients) return callback("Must enter recipe ingredients");
	if(! recipe.instructions) return callback("Must enter recipe instructions");
	if(! recipe.uid) return callback("User must be logged in to create recipe. No User Id available in session");	
	var stmtArr = [];
	var stmtColumns = "INSERT into RECIPES (";
	var stmtValues = " VALUES (";
	
	stmtColumns += "name "; stmtArr.push(recipe.name); stmtValues += "$"+stmtArr.length;
	stmtColumns += ", ingredients "; stmtArr.push(recipe.ingredients); stmtValues += ",$"+stmtArr.length;
	stmtColumns += ", instructions "; stmtArr.push(recipe.instructions); stmtValues +=",$"+stmtArr.length;
	stmtColumns += ", uid "; stmtArr.push(recipe.uid); stmtValues +=",$"+stmtArr.length;

	if(recipe.totaltime){
		stmtColumns += ",totaltime ";
		stmtArr.push(recipe.totaltime);
		stmtValues +=",$"+stmtArr.length;
	 };
	if(recipe.servings){
		stmtColumns += ",servings ";
		stmtArr.push(recipe.servings);
		stmtValues +=",$"+stmtArr.length;
	};
	if(recipe.bitter){
		stmtColumns += ",flavor_bitter ";
		stmtArr.push(recipe.bitter);
		stmtValues +=",$"+stmtArr.length;
	};
	if(recipe.sweet){
		stmtColumns += ",flavor_sweet ";
		stmtArr.push(recipe.sweet);
		stmtValues +=",$"+stmtArr.length;
	};
	if(recipe.salty){
		stmtColumns += ",flavor_salty ";
		stmtArr.push(recipe.salty);
		stmtValues +=",$"+stmtArr.length;
	};
	if(recipe.sour){
		stmtColumns += ",flavor_sour ";
		stmtArr.push(recipe.sour);
		stmtValues +=",$"+stmtArr.length;
	};		
	if(recipe.meaty){
		stmtColumns += ",flavor_meaty ";
		stmtArr.push(recipe.meaty);
		stmtValues +=",$"+stmtArr.length;
	};
	if(recipe.calories){
		stmtColumns += ",calories ";
		stmtArr.push(recipe.calories);
		stmtValues +=",$"+stmtArr.length;
	};
	if(recipe.imagename){
		stmtColumns += ",imagename ";
		stmtArr.push(recipe.imagename);
		stmtValues +=",$"+stmtArr.length;
	}
	else{
		stmtColumns += ",imagename ";
		stmtArr.push("recipe"+	(Math.ceil(Math.random() * 9)) + ".png");
		stmtValues +=",$"+stmtArr.length;
	}
	
	var stmt = stmtColumns + ")" + stmtValues + ") RETURNING rid;";


	console.log(stmt + "\r \n \r" + stmtArr);

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err', err);
		}

		client.query(stmt, stmtArr, function(err, results){
			done();
			if(err){
				callback("Internal Database Error");
				return console.error('err', err);
			}
			callback(err, results.rows[0]);
		});

		
	});
	pg.end();
}



/*	example input object for addRecipe:
	uid and rid required. Else, fields optional
var recipeObject = 
	{
	uid:34,
	rid:20,
	name:"pancakes",
	ingredients: ["milk","eggs","flour"],
	instructions: "Make some pancakes!",
	totaltime: 200
	servings: 5
	sweet: .5
	salty: .1
	bitter: .2
	meaty: .3
	calories: 10000000
	}

*/
function editRecipe(recipe, callback){
//	var stmtArr = [recipe.name, recipe.ingredients, recipe.instructions];
/*	
	var stmt = "INSERT into RECIPES values(DEFAULT,$1,$2,$3";
	if(recipe.totalTime) { stmtArr.push(recipe.totalTime); stmt += ",$"+ stmtArr.length; }
 	if(recipe.servings) { stmtArr.push(recipe.servings); stmt += ",$" + stmtArr.length; }
	stmt += ") RETURNING rid;";
*/

	if(! recipe.rid) return callback("Must supply a recipe id");
	if(! recipe.uid) return callback("User must be logged in. No User Id inlcuded");	
	var stmtArr = [];
	var stmt = "UPDATE recipes SET ";
	stmtArr.push(recipe.uid); stmt += "uid = $" + stmtArr.length;
	if(recipe.name){
		stmtArr.push(recipe.name);
		stmt+= ",name=$" + stmtArr.length;
	};
	if(recipe.ingredients){
		stmtArr.push(recipe.ingredients);
		stmt+= ",ingredients=$" + stmtArr.length;
	};
	if(recipe.instructions){
		stmtArr.push(recipe.instructions);
		stmt+= ",instructions=$" + stmtArr.length;
	};
	if(recipe.totaltime){
		stmtArr.push(recipe.totaltime);
		stmt+= ",totaltime=$" + stmtArr.length;
	};
	if(recipe.servings){
		stmtArr.push(recipe.servings);
		stmt+= ",servings=$" + stmtArr.length;
	};
	if(recipe.bitter){
		stmtArr.push(recipe.bitter);
		stmt+= ",flavor_bitter=$" + stmtArr.length;
	};
	if(recipe.sweet){
		stmtArr.push(recipe.sweet);
		stmt+= ",flavor_sweet=$" + stmtArr.length;
	};
	if(recipe.meaty){
		stmtArr.push(recipe.meaty);
		stmt+= ",flavor_meaty=$" + stmtArr.length;
	};
	if(recipe.sour){
		stmtArr.push(recipe.sour);
		stmt+= ",flavor_sour=$" + stmtArr.length;
	};
	if(recipe.salty){
		stmtArr.push(recipe.salty);
		stmt+= ",flavor_salty=$" + stmtArr.length;
	};
	if(recipe.calories){
		stmtArr.push(recipe.calories);
		stmt+= ",calories=$" + stmtArr.length;
	};
	if(recipe.imagename){
		stmtArr.push(recipe.imagename);
		stmt+= ",imagename=$" + stmtArr.length;
	};
	stmtArr.push(recipe.uid);
	stmt+=" WHERE uid = $" + stmtArr.length;
	stmtArr.push(recipe.rid);
	stmt+=" and rid = $" + stmtArr.length;
	stmt+=" RETURNING rid;";

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err', err);
		}

		client.query(stmt, stmtArr, function(err, results){
			done();
			if(err){
				if(err.code === '23505'){
					callback("Recipe name already taken.");
					return console.error('err',err);
				}				
				callback("Internal Database Error");
				return console.error('err', err);
			}
			if(results.rows[0]){
			callback(err, results.rows[0]);
			}
			else callback("Recipe not found");
		});		
	});
	pg.end();
}


function addBlogEntry(entry, callback){
	var stmtArr = [entry.uid, entry.title, entry.extract];

	var stmt = "INSERT into BLOGS values(DEFAULT,$1,$2,NOW(),$3) RETURNING eid;";


	var error = null;
	if( entry.uid === null ) error = "user must be logged in";
	else if(entry.title === null || entry.title === "")	error = "blog entry must have a title";
	else if(entry.extract === null || entry.extract === "")	error = "blog entry must contain some text content";
	if (error){
		callback(error);
		return;
	}
/*	var stmt = "INSERT into BLOGS values(DEFAULT,";
	stmt +=  "'" + entry.uid + "','" + entry.title + "',NOW(),'" + entry.extract + "'";
	stmt += ") RETURNING eid;";
*/	
	pg.connect(conString, function(err, client, done){
		if(err){
			callback(err, error);
			return console.error('err', err);
		}	
		client.query(stmt, stmtArr,  function(err, results){
			done();
			entry.eid = results.rows[0].eid
			callback(err, entry);
		});
	});
	pg.end();
}

function deleteBlogEntry(eid, callback){
	var stmtArr = [eid];
	var stmt = "DELETE FROM blogs WHERE eid = $1;";

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}
		
/*		var stmt = "DELETE FROM blogs WHERE eid = ";
		stmt += id + ";"; */
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(err) callback(err);
			else callback(err, "Deletion successful");
		});
	});
	pg.end();
}

function editBlogEntry(entry, callback){
	var stmtArr = [];
	
	var stmt = "UPDATE blogs SET ";
	if(entry.title) { stmtArr.push(entry.title) ; stmt += "title = $" + stmtArr.length ; }
	if(entry.extract) {
		if(stmtArr.length > 0) { stmt += "," ; }
		stmtArr.push(entry.extract); stmt += "extract = $" + stmtArr.length ;
	}
	stmtArr.push(entry.eid);
	stmt += " WHERE eid = $"+ stmtArr.length + ";";
	var error = null;
	if(!entry.eid) error = "blog entry must already exist";
	/*
	else if(!entry.title || entry.title === "")	error = "blog entry must have a title";
	else if(!entry.extract || entry.extract === "")	error = "blog entry must contain some text content";
*/
	if ( stmtArr.length === 1){
		callback("No changes made");
		return;
	}
	if (error){
		callback(error);
		return;
	}
	/*
	var stmt = "UPDATE blogs SET title='" + entry.title + "',extract='" + entry.extract + "' ";
	stmt += "WHERE eid=" + entry.eid + ";";
	*/
	pg.connect(conString, function(err, client, done){
		if(err){
			callback(err, error);
			return console.error('err', err);
		}	
		client.query(stmt, stmtArr, function(err, results){
			done();
			callback(err, entry.title);
		});
	});
	pg.end();
}

function getBlogEntry(eid, callback){
	var stmtArr = [eid];

	var stmt = "SELECT * FROM blogs WHERE eid = $1;";


	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}
/*		
		var stmt = "SELECT * FROM blogs WHERE eid = ";
		stmt += id + ";";
*/
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(result.rows[0]) callback(err, result.rows[0]);
			else callback("Blog entry does not exist");
		});
	});
	pg.end();
}

function getUserBlog(uid, callback){
	var stmtArr = [uid];

	var stmt = "SELECT * FROM blogs WHERE uid = $1;";

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}

		client.query(stmt, stmtArr, function(err, result){
			done();
			if(result.rows[0]) callback(err, result.rows);
			else callback("User's blog contains no entries");
		});
	});
	pg.end();
}

function deleteUserBlog(uid, callback){
	var stmtArr = [uid];

	var stmt = "DELETE FROM blogs WHERE uid = $1"; 

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}
		
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(err) callback(err);
			else callback(err, "Deletion successful");
		});
	});
	pg.end();
}

/*
	
*/
function search(query, callback){


	var stmtArr = [];
	var stmt = "SELECT * FROM recipes WHERE ";
	stmt += "true "; //added true so I don't have to deal with comma logic everywhere.
	if(query.ingredients){
		stmtArr.push(query.ingredients);
		stmt += " and ingredients @> $" + stmtArr.length + "::text[] ";
	}
	if(query.name){
		stmtArr.push(query.name);
		stmt += " and LOWER(name) like concat('%',LOWER($" + stmtArr.length + "),'%') ";
	}
	if(query.maxtime){
		stmtArr.push(query.maxtime);
		stmt += " and totaltime <= $" + stmtArr.length;
	}
	if(query.mintime){
		stmtArr.push(query.mintime);
		stmt += " and totaltime >= $" + stmtArr.length;
	}
	if(query.minservings){
		stmtArr.push(query.minservings);
		stmt += " and servings >= $" + stmtArr.length;
	}
	if(query.maxservings){
		stmtArr.push(query.maxservings);
		stmt += " and servings <= $" + stmtArr.length;
	}
	if(query.rating){
		stmtArr.push(query.rating);
		stmt += " and rating >= $" + stmtArr.length;
	}
	if(query.calories){
		stmtArr.push(query.calories);
		stmt += " and calories <= $" + stmtArr.length;
	}
	if(query.bitter){
		stmt += " and flavor_bitter > 0";
	}
	if(query.sweet){
		stmt += " and flavor_sweet > 0";
	}
	if(query.sour){
		stmt += " and flavor_sour > 0";
	}
	if(query.salty){
		stmt += " and flavor_salty > 0";
	}
	if(query.meaty){
		stmt += " and flavor_meaty > 0";
	}
	stmt += ";";
	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.error('err',err);
		}
		
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(err){
				callback("Internal Database Error");
				return console.error('err',err);
			}
			if(results.rows[0]){
				callback(err, result.rows);
			}
			else{
				callback("No results found");
			}
		});
	});
	pg.end();

	
}

exports.getUserById = getUserById;
exports.addUser = addUser;
exports.addRecipe = addRecipe;
exports.getByIngredients = getByIngredients;
exports.printAllRecipes = printAllRecipes;
exports.printAllUsers = printAllUsers;
exports.getRecipesByQuery = getRecipesByQuery;
exports.getRecipesByUser = getRecipesByUser;
exports.getRecipeById = getRecipeById;
exports.login = login;
exports.addBlogEntry = addBlogEntry;
exports.getUserBlogById = getUserBlog;
exports.getBlogEntryById = getBlogEntry;
exports.deleteBlogEntryById = deleteBlogEntry;
exports.deleteUserBlogById = deleteUserBlog;
exports.editBlogEntry = editBlogEntry;
exports.editUser = editUser;
exports.editRecipe = editRecipe;
exports.search = search;