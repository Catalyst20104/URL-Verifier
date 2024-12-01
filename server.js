const express = require("express");
const bodyParser = require("body-parser");
const checkUrl = require("./routes/checkUrl");

const app = express();
app.use(bodyParser.json());

app.use('/api/url', checkUrl);

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log("Server Started"));