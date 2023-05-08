// Description: This file is the entry point to our application. It starts the server and listens for requests.
//We also import the movies route here and use it as middleware.
// We also import the cors and express modules here.
import express from "express";
import cors from "cors";
import movies from "./api/movies.route.js";

//What is a middleware function?
//A middleware function is a function that has access to the request object (req), the response object (res), and
//the next function in the application’s request-response cycle.
//The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

/**Middleware functions*/
//They are functions that express executes in the middle after the incoming request and before the outgoing response
//or before the output is sent to the client.
//The middleware might make changes to the request and response objects, end the request-response cycle,
//or call the next middleware function in the stack.
//The middleware functions are executed in the order they are registered.

/**What is the next() function */
//The next() function is used to pass control to the next middleware function. If the current middleware function does not end t
//the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

// Create a new express application instance
const app = express();

/** Registering a middleware */
//The app.use() method is used to register middleware functions.

//we use the cors module to allow cross-origin requests
app.use(cors());

//we use the express.json() middleware to parse incoming requests with JSON payloads
//the express.json() is the JSON parsing middleware to enable the server to read and accept JSON data in the request body.
app.use(express.json());

//we use the movies route as middleware
/** Genereal conventio */
//the general convention for API is to begin the path with /api/<version number>/ e.g. /api/v1/movies
//the version number is used to indicate the version of the API. This is useful when you want to make changes to the API.
//movies is the route we created in the movies.route.js file
//The subsequent specific routes are specified in the 2nd argument "movies" of the app.use() method.
app.use("/api/v1/movies", movies);

//error handling middleware
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

//export the app
export { app };
