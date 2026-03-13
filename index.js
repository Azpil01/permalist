import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise"
import { createRequire } from "node:module";

const app = express();
const port = 3000;

const require = createRequire(import.meta.url);

let theUser;
let thePass;


try {
    const local = require("./config.locals.cjs"); //Le decimos donde estan las variables
    theUser = local.USER; //Las asignamos a las variables globales "theUser"
    thePass = local.PASSWORD;
} catch (error) {    
}

const connection  = await mysql.createConnection({
  host: "srv1293.hstgr.io", //info proporcionada por hostinger
  user: theUser, //info proporcionada por hostinger
  database: "u354636099_test1", //info proporcionada por hostinger
  password: thePass, //! NO SE SUBE
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const [result, fields] = await connection.query("SELECT * FROM items")
    console.log(result)
    console.log("...")
    console.log(fields)
  } catch(err){
    console.log(err);
  }
 
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
  
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
