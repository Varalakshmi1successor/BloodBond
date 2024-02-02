import './config/db.js';
import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";
import UserRouter from './api/user.js';
import User from './models/user.js';
const __dirname = dirname(fileURLToPath(import.meta.url));      
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use('/user', UserRouter);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.get("/donor", (req, res) => {
  res.sendFile(__dirname + "/public/donor.html");
});
app.get("/recipient", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/search", (req, res) => {
  res.sendFile(__dirname + "/public/search.html");
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
