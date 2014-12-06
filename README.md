Using the cookups database
================================
To use the database, you will need to perform a small bit of set up
- set your user's psql password to cookups.org (sorry if this seems a bit crummy!)
- run the database building script
- install the cookupsdb module
- start coding!

Each of these steps are detailed below


Example search Object
============================
This is the format of an object that's sent into the database to search on yummly and postgres

```javascript
example object:
var query = {
        allowedIngredient:['eggs','milk'],
        recipeName:'pancake',
        totalTime:10,
        maxTotalTimeInSeconds:600,
        yield:5,
        numberOfServings:5,
        rating:3.5,
        nutrition: {
                enerc_kcal: {
                        min:100,
                        max:1000
                }
        },
        flavor:{
                bitter:{
                        min:.1,
                        max:.7
                },
                sweet:{
                        min:0,
                        max:.9
                }
                sour:{
                        min:0,
                        max:0
                }
                salty:{
                        min:0,
                        max:1
                }
                meaty:{
                        min:.3,
                        max:1
                }
        }
} 
```



Database Prep Work For Linux
========================================

##PostgreSQL install using Debian Package Manager Apt
```bash
$ sudo apt-get update
$ sudo apt-get install postgresql-9.3
$ sudo apt-get install g++
$ sudo apt-get install postgresql-server-dev-9.3
```

##PostgreSQL user, password, and default db
The postgres user will take your system username in your terminal shell. On the server, this will be cinnamoncrickets. In my case it is jon. 
This, by default, is the user that accesses the database.

If you haven't created a postgres user and default database,
Start postgres using the 'postgres' user, and create yourself a database.
This default db won't be used for cookups, but you still need a username anyway.
```bash
$ sudo -u postgres psql
postgres=> create user --yourhomeusername-- createdb createuser password 'cookups.org';
postgres=> create database --yourusername-- owner --yourusername--;
postgres=> \q

```

To access our database, the module logs in with your username and password: cookups.org ..... this is set in code

**NOTE:** this password is **not** your system password (for sudo calls and such). This password is only used in psql.

To change your users psql password to work with cookups, if not already set
```bash
sudo -u postgres psql -c "alter user $USER password 'cookups.org'"
```

Once this psql password is set for your current user, the module can use your username to access the database.

**NOTE:** when you're set up and accessing database,**If** you recieve an error that begins like: 
```bash
error { [error: password authentication failed for user "username"]
 name: 'error'
 yatta...yatta......	
return console.err('err', err);
	               ^
TypeError: Object #<Console> has no method 'err'
.....yatta yatta yatta............ more error trace
```

It is most likely because your users psql password is not set to cookups.org, and does not match the password that the module is using to access the database. 


Database Table Building Script
================================
##Run the createDataBase.sh script
This script is found in the setup_database/ directory

	bash createDataBase.sh

This script create a dababase named 'cookupsdb' and will erase any existing cookups tables in your database, create new tables, and populate tables with silly starter data.

**NOTE:** whenever changes are made to the database and module, you should run this script again. The database schema/design might change when new features are added, and this will ensure that the database to work with the module.


###The Scripts Components Explained
The script interacts with the .sql files in the **setup_database/** directory
-  **drop.sql** will purge existing cookups tables from your database
-  **schema.sql** will create cookups tables in your database
-  **populate_db.sql** will create starter entries in your database. A few users and recipes.


Installing cookupsdb: the Database Module
===========================================

Add the dependency to your project's package.json and run npm install
```json
  "dependencies": { 
    "cookupsdb" : "*"
   }
```
```bash
npm install
```
This will install the latest version of the module along with all other project modules.


**If** you choose not to include the module as a dependency in package.json,

```bash
npm install cookupsdb
```
This will install the latest version of the module

Using the DatabaseModule in Code
=============================================


##Usage
In general, the module functions will require two arguments: a **Request Object** and a **callback function(error, result)**
Request object formats are specific to each function, but use similar tags, such as *uid* *uname* *email* *password* *ingredients[]*. More detailed documentation soon.

```javascript
var db = require('cookupsdb');
```
##Examples:

###Register New User
Register using an object with manditory {uname, email, password}. Optional {bio, picturepath}
Successful registration will return user object with user properties, excluding the password.
**Note:** duplicate emails not allowed in system. Working on an error response to handle this case.
```javascript
var db = require('cookupsdb');

var newUser = {
				uname:'billnye',
				email:'bill@nye.com',
				password:'thescienceguy',
				bio:'I am Bill Nye, The Science Guy.'
				}

db.addUser(newUser, function(error, result){
	if(error) return console.log(error);
	console.log(result.uname + " has registered using " + result.email + ". Your user ID is " + result.uid );
});
```



###Login:
Login using a request object {email, password}
If successful, returned available fields as user object {uid, uname, email, bio, picture}
Unsuccessful, error will be a descriptive error string: wrong pass, no user found
```javascript
var db = require('cookupsdb');

var user = {
			email: 'bill@nye.com',
			password: 'thescienceguy'
			}

db.login(user, function(error, result){
	if(error) return console.log(error);
	console.log(result.uname + " successfully logged in. Your Id is " + result.uid );
});
```

All methods are documented in [cookups dspec](https://github.com/umass-cs-326/team-cinnamon-crickets/blob/master/docs/dspec/dspec.md).
Also, you can refer to 'databaseConsoleInput.js' to see actual implementation examples how to use the functions.

Database Access Tool: databaseConsoleInput
============================================

##Using and testing the database functions

###databaseConsoleInput.js
**databaseConsoleInput.js** is a Node.js program/tool that accesses the cookups database. It provides example uses of different database functions. It includes most of the module's features as they are implemented in the module, however, more advanced features don't take command line input, and instead have a hardcoaded object. **Note** that this is not the module - It uses the module and demonstrates how to model a program to use the module.

run databaseConsoleInput.js

```shell
node databaseConsoleInput.js -[r|u|rid|nu|nr|i] {arguments}
```

###flags:###
print All Recipes:
```sh
-r

~/$ node databaseControlInput.js -r
```
print All Users:
```bash	
-u

~/$ node databaseControlInput.js -u
```

get recipe by recipeID:
requires a recipe's id number
```bash
-rid recipeID

~/$ node databaseControlInput.js -rid 4
```

add new user:
requires username email and password
```bash
-nu username email password

~/$ node databaseControlInput.js -nu aaron aar@gmail.com aaron123
```

add new recipe:
requires userId recipename recipeinstructions(nospaces from shell) ingredient [optionally more ingredients]
```bash
-nr id name instructions ingredient [additional ingredients]

~/$ node databaseControlInput.js -nr 3 dangerousDumplings RollDumplingsBoilEat eggs flour milk oil yeast
```

retrieve By Ingredients:
requires at least one ingredient
```bash	
-i [ingredients]

~/$ node databaseControlInput.js -i milk bread butter
```

login user:
requires useremail and password
```bash
-l email password

~/$ node databaseControlInput.js -l aaron aar@gmail.com
```


*JonSaj*
