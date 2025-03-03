import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database: "permalist",
  password: "usmanwasti",
  port : 5432
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function createdList() {
  const result = await db.query("SELECT * FROM list ORDER BY id ASC");
  items = result.rows;
  return result.rows;
  
}

app.get("/", async(req, res) => {
  await createdList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items ,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try{
  const addnew = await db.query("INSERT INTO list (title) VALUES($1)", [item]);
  items.push(addnew);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const updatedId = req.body.updatedItemId;
  const updatedTitle = req.body.updatedItemTitle;
  try{
  const updataData = await db.query("UPDATE list SET title = $1 where id = $2", [updatedTitle , updatedId]);
  items.push(updataData);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  const deleteItem = req.body.deleteItemId;
  try{
  const deleteData = await db.query("DELETE FROM list WHERE id = $1" , [deleteItem]);
  items.push(deleteData);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
