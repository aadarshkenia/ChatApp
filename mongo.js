var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bcrypt = require('bcrypt');

var url = 'mongodb://localhost:27017/test';

/*
var insertDocument = function(db, callback){
	db.collection('restaurants').insertOne({
		"address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      	},
      	"borough" : "Manhattan",
      	"cuisine" : "Italian",
      	"grades" : [
	        {
	            "date" : new Date("2014-10-01T00:00:00Z"),
	            "grade" : "A",
	            "score" : 11
	        },
	        {
	            "date" : new Date("2014-01-16T00:00:00Z"),
	            "grade" : "B",
	            "score" : 17
	        }
      	],
		"name" : "Vella",
		"restaurant_id" : "41704620"
  	}, function(err, result){
		assert.equal(err, null);
		console.log("Inserted a document into the restaurants collection.");
		callback(result);
	});
}

MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	insertDocument(db, function(){
		db.close();
	});
});

*/


//Returns true on successful insertion, else false;
var insertNewUser = function(db, username, password, callback){
	if(!db || !username || !password)
		return false;

	//Also check if username already exists


	bcrypt.hash(password, 8, function(err, hash){
		if(err){
			console.log("Error in hashing password.");
			return false;
		}
		else{
			console.log("Hashed password: " + hash);
			db.collection('users').insertOne({
				'username' : username,
				'password' : hash,
			}, function(err, res){
				callback();
				if(err){
					console.log("Error while inserting to db.")
					return false;
				}
				else{
					console.log("Successfully inserted user to database.");
					return true;
				}
			});
		}
	});		
}


//Returns true on successful validation, else false
var validateUser = function(db, username, password, callback){
	if(!db || !username || !password){
		console.log("Null");
		return false;
	}
	
	var cursor = db.collection('users').find({'username' : username});
	
	cursor.count(function(err, count){
		
		if(err){
			console.log("Search query gave error.");
			callback();
			return false;
		}
		else{
			if(count == 0){
				console.log("Got no users with that username");
				callback();
				return false;
			}
			else{
				//Retrieve hashed password.
				cursor.toArray(function(err, docs){
					if(err){
						console.log("Error while conversion of cursor to array.")
						callback();
						return false;
					}
					else{
						var hashedPassword = docs[0].password;
						bcrypt.compare(password, hashedPassword, function(err, same){
							if(err){
								console.log("Error in comparing hashes.");
								callback();
								return false;
							}
							console.log("Final validation ans: " + same);
							callback();
							return same;
						});
					}
				});
			}
		}

	});

}

/*
MongoClient.connect(url, function(err, db){
	insertNewUser(db, 'Aadarsh', "password", function(){
		db.close();
	});
});*/

MongoClient.connect(url, function(err, db){	
	validateUser(db, "Aadarsh", "paword", function(){
		db.close();
	});
});