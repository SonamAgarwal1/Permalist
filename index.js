import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "postgres",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  const result = await db.query("select * from items");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log(typeof item);
  await db.query("insert into items (title) values ($1)", [item]);
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
  console.log(updatedItemTitle);
  await db.query("update items set title=$1 where id=$2", [
    updatedItemTitle,
    updatedItemId,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  await db.query("delete from items where id=$1", [deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
