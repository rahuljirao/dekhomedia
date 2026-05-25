require("dotenv").config();
const app = require("./server");
const PORT = 5010;
const path = require("path");

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
