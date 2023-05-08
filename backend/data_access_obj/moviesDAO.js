//This file will contain the code for the MoviesDAO class.

//1a. define a variable called movies and set it to null.
//It stores the reference to the database collection of movies.
let movies;

//A DAO is a class that abstracts the details of data access from the rest of the application. In this case,
//the DAO will be responsible for fetching movies from the database. The DAO will be used by the movies route handler
//to fetch movies from the database.
//A DAO which stands for "Data Access Object" is an object that provides an abstract interface to some type of
//database in this case MongoDB or storage system.
//DAOs are used to separate the data access logic from the business logic of an application.
//This makes it easier to change the persistence layer of an application without affecting the business logic.
//The idea is to seperate the details of working with database from the rest of the application.
//This way, if we need to change the database, we can do so without changing the rest of the application.

/***************  Creating a DAO: Data access object ************** */

//1b. Define a class called MoviesDAO and export it as the default export.

export default class MoviesDAO {
  //2. define the static async injectDB method which takes a connection as a parameter.
  //Define a static method called injectDB which takes a connection as a parameter.
  //This method will be used to inject the database connection into the DAO.
  //This method will be called by the movies route handler when the server starts.
  // This special method "static async injectDB(conn)" is a special method that allows the application to connect to a database.
  //the method is called as soon as the server starts and provides the database reference to movies.
  static async injectDB(conn) {
    //3. check if the "movies" variable already has a value, and if it does, it returns without doing anything. Otherwise,
    //it tries to connect to a database and set the "movies" variable to refer to a collection of movie documents within that database
    if (movies) {
      return;
    }

    //if the reference already exists,we return without doing anything.
    try {
      //we go ahead to connect to the database name (process.env.MOVIEREVIEWS_NS) and movie collection
      movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("movies");
    } catch (e) {
      // if we fail to get a reference, we send an errror message to the console.
      console.error(
        `Unable to establish collection handles in moviesDAO: ${e}`
      );
    }
  }

  /****************************************** Retrieving Movies ***************************** */

  //4. Define a static method called getMovies() which takes an object as a parameter. this method gets all the movies from the database.
  //This method takes an optional object parameter that can contain filters to apply to the query, the page number of results to return, and the number of movies per page.
  //If these values are not provided, they default to null, 0, and 20, respectively.

  // The getMovies method accepts a filter object as its first argument. the default filter has no filters, retrieves results at page 0, and returns 20 movies per page.
  static async getMovies({
    //default filter, page and movies per page
    filters = null,
    page = 0,
    moviesPerPage = 20, // will only get 20 movies at once
  } = {}) {
    //5. Define a query object that will be used to find movies in the "movies" collection based on the search criteria.
    //the query variable will be empty unless a user specifies filters in his retrieval, in which case we will put togther a query.
    let query;

    //6. check if the filter parameter is not null or if any filter is provided
    //if the the filter parameter is null, create a query object based on the filters.
    //The query is used to find movies in the "movies" collection based on the search criteria

    //we provide filtering results by movie title ("title") and movie rating ("rated" e.g. "G", "PG", "R").
    //we first check if the filters object contains the property "title" with filters.hasOwnProperty("title").
    if (filters) {
      if (filters.hasOwnProperty("title")) {
        //if title is provided we use the $text query operator and $search to search for movies titles containing the user specified search terms
        query = { $text: { $search: filters["title"] } };
      } else if (filters.hasOwnProperty("rated")) {
        //if rated is provided we use the $eq query operator to search for movies with the specified rating.
        //if the user specified ratinng value is equal to the value in the database field
        query = { rated: { $eq: filters["rated"] } };
      }
    }

    /*********** We find all movies that fit our query and assign it to a cursor ***************** */

    //7. Define a cursor object that will be used to iterate over the results of the query.
    let cursor;

    //why do we need a cursor? because our query can potentially match very large sets of documents.
    // a cursor fetches these documents in batches to reduce both memory consumption and network bandwidth usage.
    //Cursors are highly configurable and allow us to specify a number of options to control the batch size and other aspects of the query.
    //e.g. we can limit the number of movies per page and skip the number of movies per page, using the limit and skip methods.
    //We can also sort the results of the query using the sort method.
    //We can also specify a projection to limit the fields that are returned in the results using the project method.
    //We can also specify a collation to control the locale and case sensitivity of the query using the collation method.
    //When skip and limit methods are used together, the skip method is applied first,
    // and the limit method is applied after the skip or only to the documents left over after the skip.

    //This will allow us to implement pagination in the front end, because we can retrieve a specific page results
    // by specifying the page number and the number of movies per page.

    //If the  specific page is 1, we skip 20 results first(moviesPerpage * page) and then retrieve the next 20 results(limit moviesPerPage).
    //if the specific page is 2, we skip 40 results first(moviesPerpage * page) and then retrieve the next 20 results(limit moviesPerPage).

    //8. try to find movies in the "movies" collection based on the search criteria.
    //The "find" method returns a "cursor" object, which is a pointer to the results of the query.
    try {
      cursor = await movies
        .find(query)
        //limit the number of movies per page
        .limit(moviesPerPage)
        //skip the number of movies per page
        //skips over any pages before the current one.
        .skip(moviesPerPage * page);
      //9. convert the cursor object to an array of movies.
      const moviesList = await cursor.toArray();
      //10. get the total number of movies that match the query.
      //We get the total number of movies by counting the number of documents in the query and return moviesList
      //and totalNumMovies in an object.
      const totalNumMovies = await movies.countDocuments(query);
      return { moviesList, totalNumMovies };

      //11. if there is an error, log the error and return an empty array of movies along with a total number of movies of 0.
      //if there is error we just return an empty moviesList and totalNumMovies of 0.
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
  }
}
