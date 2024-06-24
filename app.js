// import all module
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// impot routes
const warungRouter = require("./routes/warung.routes");
const productRouter = require("./routes/product.routes");
const typeRouter = require("./routes/type.routes");

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use route as middleware
app.use("/warungs", warungRouter);
app.use("/products", productRouter);
app.use("/types", typeRouter);

// greeting
app.get("/", (req, res) => {
  res.send({
    greeting: "Welcome to cariwarung.id",
  });
});





// information server run
const port = 3000;
app.listen(port, () => {
  console.log(`Cariwarung app listening on port ${port}`);
});
