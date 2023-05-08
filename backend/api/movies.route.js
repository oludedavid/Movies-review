//creating our routes: this file will contain routes that different people can access

//import express
import express from "express";

//get access to express router
const router = express.Router();

//route to get all movies
router.route("/").get((req, res) => {
  res.send("Hello World!");
});

//every route in this file will start with /api/v1/movies
//export the router
export default router;
