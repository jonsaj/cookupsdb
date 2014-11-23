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
			return console.err('err', err);
		}
		client.query(stmt, stmtArr, function(err, results){
			done();
			if(err){
				callback("Internal Database Error");
				return console.err('err', err);
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
			callback(err, error);
			return console.err('err', err);
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
			return console.err('err', err);
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
	var stmt = "SELECT name FROM recipes WHERE ingredients @> '{";
	for(var i = 0; i < query.ingredients.length; i++){
		if(i === query.ingredients.length-1) stmt += query.ingredients[i];
		else stmt += query.ingredients[i] + ",";
	}
	stmt += "}'::text[];";

//	console.log("sql: " + stmt);	
	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.err('err', err);
		}
		client.query(stmt, function(err, results){
			done();
			callback(err, results.rows);
		});
	});	
	pg.end();
}

function printAllRecipes(callback){

	pg.connect(conString, function(err, client, done){
		if(err){
			return console.err('err', err);
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
			return console.err('err', err);
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

/*
function addUserInfo(userInfo, function(err, client, done){
	
	pg.connect(conString, function(err, client, done){
		
		var stmt = 	
	});
}
*/

function getRecipeById(rid, callback){

	var stmtArr = [rid];

	var stmt = "SELECT * FROM recipes WHERE rid = $1;";

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.err('err',err);
		}
		
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(result.rows[0]) callback(err, result.rows[0]);
			else callback("Recipe Not Found");
		});
	});
	pg.end();
}
/*
	needs imagepath. Default for now. same with flavors.
*/
function addRecipe(recipe, callback){
	var stmtArr = [recipe.name, recipe.ingredients, recipe.instructions];
	
	var stmt = "INSERT into RECIPES values(DEFAULT,$1,$2,$3";
	if(recipe.totalTime) { stmt += ",$4"; stmtArr.push(recipe.totalTime); }
 	if(recipe.servings) { stmt += ",$5"; stmtArr.push(recipe.servings); }
	stmt += ") RETURNING rid;";

	pg.connect(conString, function(err, client, done){
		if(err){
			callback("Internal Database Error");
			return console.err('err', err);
		}

		client.query(stmt, stmtArr, function(err, results){
			done();
			if(err){
				callback("Internal Database Error");
				//done();
				return console.err('err', err);
			}
			//new stmt
			stmt = "INSERT into USRECIPES values(";
			stmt += recipe.uid + "," + results.rows[0].rid;
			stmt += ");";
//	console.log(stmt);		

			callback(err, results.rows[0]);
			/*
				// IMPORTANT: need a way to perform this in one query
			client.query(stmt, function(err, results_2){
				done();
				if(err){
					callback("Internal Database Error");
					return console.err('err', err);	
				}
				recipe.rid = results.rows[0].rid;
				callback(err, recipe);
			});
			*/
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
			return console.err('err', err);
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
			return console.err('err',err);
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
			return console.err('err', err);
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
			return console.err('err',err);
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
			return console.err('err',err);
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
			return console.err('err',err);
		}
		
		client.query(stmt, stmtArr, function(err, result){
			done();
			if(err) callback(err);
			else callback(err, "Deletion successful");
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
