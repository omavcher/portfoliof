const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

connectDB();

// Website reload configuration
const url = `https://portfoliof-nfnr.onrender.com`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloaded");
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);

app.use(cors({ origin: process.env.PORTFOLIO, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));


// For urlencoded data, increase the limit as well
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use("/api", require("./routes/authAbout"));

app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Om Avcher</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        flex-direction: column;
                        background-color: #121212;
                        color: #ffffff;
                        font-family: Arial, sans-serif;
                        text-align: center;
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 20px;
                    }
                    a {
                        padding: 12px 24px;
                        background: #FB4B04;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-size: 18px;
                        font-weight: bold;
                        transition: 0.3s;
                    }
                    a:hover {
                        background: #d84303;
                    }
                </style>
            </head>
            <body>
                <h1>😅 You Over Smart</h1>
                <a href="https://omavchar.vercel.app/" target="_blank">Go Portfolio</a>
            </body>
        </html>
    `);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
