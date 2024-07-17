require("dotenv").config();

const express = require('express');
const app = express();

const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { exec } = require('child_process');
const axios = require('axios');
const os = require('os');

const TALLY_URL = 'https://4d1b-121-241-109-219.ngrok-free.app';


app.use(cors());


// app.use(
//     '/tally',
//     createProxyMiddleware({
//       target: TALLY_URL,
//       changeOrigin: true,
//       onProxyRes: (proxyRes, req, res) => {
//         console.log("I am here");
//         // Add CORS headers to the response
//         proxyRes.headers['Access-Control-Allow-Origin'] = '*';
//         proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
//         proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
//       },
//     })
//   );

  const TALLY_PATH = 'C:\\Program Files\\TallyPrime (1)\\Tally.exe'; // Update with the actual path to Tally.exe

// Function to get the user's local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const ifaceName in interfaces) {
    const iface = interfaces[ifaceName];
    for (let i = 0; i < iface.length; i++) {
      const { address, family, internal } = iface[i];
      // Skip over internal (non-Internet) and IPv6 addresses
      if (family === 'IPv4' && !internal) {
        console.log(address);
        return address;
      }
    }
  }
  return null;
}

// Middleware setup in Express.js
app.use(
  '/tally',
  createProxyMiddleware({
    target: `http://127.0.0.1:9001`, // Set target to user's local IP address
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      console.log("Proxy response received");
      // Add CORS headers to the response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    },
    onError: async (err, req, res) => {
      console.error('Proxy error:', err.message);
      try {
        const response = await axios.get(`/start-tally`);
        res.send(response.data);
      } catch (error) {
        console.error('Error starting Tally:', error.message);
        res.status(500).send('Error starting Tally');
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log("Proxy request initiated");
      req.setTimeout(10000, () => {
        print("ASDASDASD");
        console.log('Request timed out.');
        res.status(504).send('Proxy request timed out.');
      });
    }
  })
);
  
  app.get('/start-tally', (req, res) => {
    // Check if Tally is running
    exec('tasklist', (err, stdout, stderr) => {
      if (err) {
        return res.status(500).send('Error checking task list');
      }
  
      if (stdout.toLowerCase().includes('tally.exe')) {
        return res.send('Tally is already running');
      } else {
        // Start Tally if not running
        exec(`start "" "${TALLY_PATH}"`, (err, stdout, stderr) => {
          if (err) {
            return res.status(500).send('Error starting Tally');
          }
          return res.send('Tally started successfully');
        });
      }
    });
  });

const PORT = process.env.PORT || 3000;

const product_routes = require("./routes/product");
const { log } = require("console");

// const connectDB= require("./db/connect");

app.get("/", (req, res) => {
    res.send("Hi, I'm live");
});

app.use(express.json()); // Middleware to parse JSON bodies

// middleware or to set router

app.use("/api/products", product_routes)

const start = async () => {
    try {
        // await connectDB(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log(PORT + " Yes I am connected");
        });
    } catch (error) {
        console.log(error);
    }
};

start();