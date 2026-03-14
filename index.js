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
    const local = require("./config.locals.cjs"); 
    theUser = local.USER; 
    thePass = local.PASSWORD;
    
} catch (error) {   
  console.error("Error al cargar config.locals.cjs: ", error.message) 
}




const connection  = await mysql.createConnection({
  host: "srv1293.hstgr.io", 
  user: theUser, 
  database: "u354636099_test1", 
  password: thePass, 
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homeworkLocal" },
];

async function getItems() {
  const result = await connection.query("SELECT * FROM items");
  items = result[0];
  return items;
}

app.get("/", async (req, res) => {
  let currentItems = await getItems();
  console.log(currentItems);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
  
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  console.log(item)
  try {
    await connection.query("INSERT INTO items (title) VALUES (?)", [item]); //El símbolo para MySQL es ?
  } catch (err) {
    console.error("Error tryng to INSERT INTO ", err);
    res.status(500).send("Error al guardar el item");
  }
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const newTitleId = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;

});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}, Azpil`);
});
