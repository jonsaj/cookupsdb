/*
 * Jon Saj
 *
*/

var db = require('./index.js');
var loginUser = {uid:null};
//var db = require('./db');
//process.stdin.setEncoding('utf8');

if (process.argv.length < 3) {
	console.log("usage: -[flag] params");
	console.log("  -u    ");
	console.log("       List All Users"); console.log();
	console.log("  -ui userID [username] [email] ");
	console.log("       Get User by Id"); console.log();
	console.log("  -ue   ");
	console.log("       Edit User Information");
	console.log("       ---Note: user's info fields can't contain spaces using this tool---"); console.log();
	console.log("  -r   ");
	console.log("       List All Recipes"); console.log();
	console.log("  -ri recipeID ");
	console.log("       Get Recipe By ID Number"); console.log();
	console.log("  -nu [username] [email] [password]  ");
	console.log("       Add New User"); console.log();
	console.log("  -nr [userid] [recipename] [instructions] [ingredient] {ingredients}");
	console.log("       Add new user recipe");
	console.log("       ---Note: instructions can't contain spaces using this tool---");console.log();
	console.log("  -i [ingredient] {ingredients}");
	console.log("       Find By Ingredients"); console.log();
	console.log("  -l [email] [password]");
	console.log("       Login User"); console.log();
	console.log("  -nb [userid] [entrytitle] [text] ");
	console.log("       Add new blog entry");
	console.log("       ---Note: text can't contain spaces using this tool---");console.log();
	console.log("  -bi blogEntryID ");
	console.log("       Get blog entry By ID Number"); console.log();
	console.log("  -bui userID ");
	console.log("       Get blog entry By user ID Number"); console.log();

	console.log("  -bdu userID");
	console.log("       Delete all blog entries for user id"); console.log();
	console.log("  -bd [blogid]");
	console.log("       Delete blog entry by entry id"); console.log();
	console.log("  -be [blogid] [- | new title] [- | new text]");
	console.log("       Edit existing blog entry. If no change in title/text, set as -");
	console.log("       ---Note: text can't contain spaces using this tool---");console.log();
	console.log("  -re [userid] [recipeid] ");
	console.log("       Edit recipe id with matching userid");
	console.log("       ---Note: I'm tired of making a ton of argument inputs. This one replaces a bunch of the recipe with dummy info");
	console.log("  -s  ");
	console.log("       fixed search query. I can't spend mroe time making this tool ~robust");

	process.exit(1);
}
else if(process.argv[2] === '-s' ){
	var quer = {};
	quer.allowedIngredient = ['milk'];
	quer.allowedIngredient.push("flour");
	//console.log(quer);
	db.search(quer, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-re' && process.argv.length >= 4){
	var rec = {uid:parseInt(process.argv[3]),
		 rid:parseInt(process.argv[4]),
		name:"crummy food",
		ingredients: ["eggs","milk","butter"],
		instructions: "make some crummy food, ya baffoon.",
		servings: 4,
		meaty: .8,
		sweet: .1,
		sour: 1,
		calories:9992,
		imagename: "foodimage.png"
	};
	db.editRecipe(rec, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-ue' && process.argv.length >= 4){
	var user = {uid:parseInt(process.argv[3])};
	if(process.argv[4] !== "-" && process.argv[4] != null) user.uname = process.argv[4];
	if(process.argv[5] !== "-" && process.argv[5] != null) user.email = process.argv[5];
	if(process.argv[6] !== "-" && process.argv[6] != null) user.password = process.argv[6];
	if(process.argv[7] !== "-" && process.argv[7] != null) user.bio = process.argv[7];
	if(process.argv[8] !== "-" && process.argv[8] != null) user.picture = process.argv[8];
	db.editUser(user, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-bdu' && process.argv.length >= 4){
	var user = {uid:parseInt(process.argv[3])};
	db.deleteUserBlogById(user.uid, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-bui' && process.argv.length >= 4){
	var user = {uid:parseInt(process.argv[3])};
	db.getUserBlogById(user.uid, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-bi' && process.argv.length >= 4){
	var blog = {eid:parseInt(process.argv[3])};
	db.getBlogEntryById(blog.eid, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-be' && process.argv.length >= 4){
	var blog = {eid:parseInt(process.argv[3])};
	if(process.argv[4] !== "-" && process.argv[4] != null) blog.title = process.argv[4];
	if(process.argv[5] !== "-" && process.argv[5] != null) blog.extract = process.argv[5];
	db.editBlogEntry(blog, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-bd' && process.argv.length >= 4){
	var blog = {eid:parseInt(process.argv[3])};
	db.deleteBlogEntryById(blog.eid, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-ri' && process.argv.length >= 4){
	var rec = {rid:parseInt(process.argv[3])};
	db.getRecipeById(rec.rid, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-ui'){
	var user = {uid:process.argv[3]};
	db.getUserById(user.uid, function(error, result){
		if(error) return console.log(error);
		else console.log(result);
	});
}
else if(process.argv[2] === '-l'){
	var user = {email:process.argv[3], password:process.argv[4]};
	db.login(user, function(error, result){
		if(error) return console.log(error);
		else console.log( "User " + result.uid + " logged in. Welcome, " + result.uname );		
	});
}

else if(process.argv[2] === '-u'){
	db.printAllUsers( function(error, result){
		if(error) return console.log('error', error);
		console.log(result);
	});
}

else if(process.argv[2] === '-r'){
	db.printAllRecipes( function(error, result){
		if(error) return console.log('error', error);
		console.log(result);
	});
}

else if(process.argv[2] === '-nu' && process.argv.length >= 6){
	var newUser = {uname:process.argv[3],email:process.argv[4],password:process.argv[5]};
	if(process.argv[6]) newUser.bio = process.argv[6];
	if(process.argv[7]) newUser.picture =  process.argv[7];
	db.addUser(newUser, function(error, result){
		if(error) return console.log('error', error);
		console.log("successfully added " + result.uname + " at Id " + result.uid);
	});


}
else if(process.argv[2] === '-nr' && process.argv.length >= 6){
	var recipe = {uid:parseInt(process.argv[3]),name:process.argv[4],instructions:process.argv[5],ingredients:[process.argv[6]]};
	for(var i = 7; i < process.argv.length; i++){
		recipe.ingredients[i-6] = process.argv[i];
	}
	recipe.bitter = .3;
	recipe.sweet = .93;
	recipe.meaty = 1;
	recipe.salty = .2;
	recipe.sour = 1;
	recipe.servings = 100;
	recipe.totaltime = 12300;
	recipe.imagename = "recipe.png";
	db.addRecipe(recipe, function(error, result){
		if(error) return console.log('error', error);
		console.log(result);
	});
}
else if(process.argv[2] === '-nb' && process.argv.length >= 4){
	var entry = {uid:process.argv[3],title:process.argv[4],extract:process.argv[5]};
	db.addBlogEntry(entry, function(error, result){
		if(error) return console.log('error', error);
		console.log(result);
	});
}
else if(process.argv[2] === '-i' && process.argv.length >= 3){
	var query = {ingredients:[]};
	for (var i = 3; i < process.argv.length; i++){
		query.ingredients.push(process.argv[i]);
	}
//	console.log(ingreds);
	db.getByIngredients(query, function(error, result){
		if(error) return console.log('error', error);
		
		console.log(result);
	});
}
else {

console.log("args didn't match");
}
