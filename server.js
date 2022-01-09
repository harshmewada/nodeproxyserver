const express = require("express");
const app = express();
const request = require("request");
const cors = require("cors");

const port = 3001;
app.use(cors());
app.options("*", cors());
app.listen(port, () => console.log(`http://localhost:3001`));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  // read query parameters
  // console.log("cat req");
  // craft IEX API URL
  console.log("req", req.params, req.query);
  // const url = `https://dutchie.com/graphql?operationName=DispensaryCategoriesQuery&variables=%7B%22productsFilter%22%3A%7B%22dispensaryId%22%3A%22609c48195960d500bb8eda47%22%2C%22pricingType%22%3A%22rec%22%2C%22Status%22%3A%22Active%22%2C%22removeProductsBelowOptionThresholds%22%3Atrue%2C%22useCache%22%3Atrue%2C%22isKioskMenu%22%3Afalse%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22537c93e54dde4f87ba0623d2fde0a213a6d4690acae1b94b9e35b2b0ac775ae5%22%7D%7D`;
  const url = req.query.url;

  res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
  const data = request(url, function (error, response, body) {
    console.error("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    console.log("body:", body);
    res.status(200).send(body);
  });
});

app.get("/category/:cateName/:page/:rowsPerPage", (req, res) => {
  const { cateName, page, rowsPerPage } = req.params;
  console.log(cateName, page, rowsPerPage);
  const URL = `https://dutchie.com/graphql?operationName=FilteredProducts&variables=%7B%22includeCannabinoids%22%3Afalse%2C%22showAllSpecialProducts%22%3Afalse%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%22609c48195960d500bb8eda47%22%2C%22pricingType%22%3A%22rec%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22removeProductsBelowOptionThresholds%22%3Atrue%2C%22types%22%3A%5B%22${cateName}%22%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3Anull%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%7D%2C%22page%22%3A${page}%2C%22perPage%22%3A${rowsPerPage}%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22b6ff0c53f33a7971a20ae49e81ab24b70c0095add648534e1c6a140943759883%22%7D%7D`;

  res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "*");

  // make request to IEX API and forward response
  request(URL).pipe(res);
});
