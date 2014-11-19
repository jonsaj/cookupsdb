#Node - Cookups Database Access Module
this readme isn't very helpful yet. Check out the readme [here](https://github.com/umass-cs-326/team-cinnamon-crickets/tree/master/database)

##Installation

	npm install cookupsdb

##Examples

```javascript
var db = require('./cookModule');

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

var user = {
            email: 'bill@nye.com',
            password: 'thescienceguy'
            }

db.login(user, function(error, result){
    if(error) return console.log(error);
    console.log(result.uname + " successfully logged in. Your Id is " + result.uid );
});
```

