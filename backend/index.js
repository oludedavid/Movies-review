/*connecting to the database and starting the server*/

//1. import app, mongodb, dotenv modules
import { app } from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

//2. create an asynchronous main function with async keyword to connect to our MongoDB cluster and call functions that access our database and start the server
async function main() {
  //3. we use the dotenv module to load environment variables from a .env file into process.env
  //we call dotenv.config() to load the environment variables
  dotenv.config();

  //4. we use the mongodb module to connect to the database
  // we create an instance of the MongoClient and pass in the database URI
  const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);

  //5. we use the process.env.PORT to get the port number from the environment variable
  //we retreive the port number from the environment variable and assign it to the port variable,
  //if we cant access it we use port 8000
  const port = process.env.PORT || 8000;

  //we use the try...catch block to handle unexpected errors

  try {
    //6. Connect to the MongoDB cluster/ connect to the database. This returns a promise
    //we use the await keyword to indicate that we block further execution until that operation has completed
    await client.connect();

    //7. start the server or tell the server to listen to requests on the specified port
    //if there are no errors in connecting to the database, we then start our web server with the app.listen() method
    //The callback function is executed when the server starts listening for requests
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  } catch (err) {
    //8. catch any errors and log them to the console
    console.error(err);
    process.exit(1);
  }
}

//9. call the main function and send any errors to the console
main().catch(console.error);
