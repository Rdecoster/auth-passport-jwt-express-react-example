#This is a backend repo showing how implementing a JWT token strategy with Passport-jwt for authentication.
###TODO
Make sure Mongodb is running and installed

Note you need to create a .env file and add in the following paramaters
NODE_ENV=development
DB_STRING= <'database string> example "mongodb://localhost:27017/myapp"
DB_STRING_PROD=<'database string for prod'>

To generate pem keys run npm genKey or node. generateKeypair.js in termninal
