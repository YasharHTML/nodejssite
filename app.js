const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.set('view engine', 'ejs');
app.use("/html", express.static("public"));
app.use(express.urlencoded({ extended: false }));

var frontenddata = [];

app.get("/", async(req, res) => {
    if (frontenddata.length == 0) {
        (async() => {
            const db = await open({
                filename: 'myDB.db',
                driver: sqlite3.Database
            })
            const result = await db.all('SELECT * FROM data');
            result.forEach(row => {
                frontenddata.push({ title: row.TITLE, text: row.textdata, imglink: row.imglink });
            });
        })()
    }
    res.redirect("/feed");

});

app.get("/feed", (req, res) => {
    if (frontenddata.length != 0) {
        res.render("index", { frontenddata });
        frontenddata = [];
    } else {
        res.redirect("/");
    }
});

app.get("/post", (req, res) => {
    res.render("post");
});

app.post("/posted", (req, res) => {
    const data = req.body;
    (async() => {
        const db = await open({
            filename: 'myDB.db',
            driver: sqlite3.Database
        })
        db.run('INSERT INTO data (TITLE, textdata, imglink) VALUES (?, ?, ?)', data.title, data.textdata, data.imglink);
    })()
    res.redirect("/")
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});