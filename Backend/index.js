const express = require("express");
const cors = require("cors");
const yahooFinance = require('yahoo-finance2').default;
const app = express()
const axios =require("axios")
app.use(cors());
const PORT = process.env.PORT || 4000



app.listen(PORT, () => {
    console.log("server is on!!!!")
})

app.get("/todayprice/:symbol", async (req, res) => {
    const symbol = req.params.symbol + ".BO"; 

    try {
        const quote = await yahooFinance.quote(symbol);
        if (!quote) return res.status(404).json({ error: 'No data found' });

        res.json({
            symbol: req.params.symbol.toUpperCase(),
            open: quote.regularMarketOpen,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow,
            close: quote.regularMarketPreviousClose,
            price: quote.regularMarketPrice,
            name: quote.shortName,
            date: new Date().toLocaleDateString()
        });
        
    } catch (err) {
        res.status(500).json({ error: 'Error fetching data', details: err.message });
    }
});



// app.get("/prediction/:symbol", async (req, res) => {
//     const symbol = req.params.symbol + ".BO";

//     try {
//         const response = await axios.get(`http://localhost:5000/predict/${symbol}.BO`); 
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Error contacting Flask server:", error.message);
//         res.status(500).json({ error: "Failed to get prediction from Flask API" });
//     }
// });


app.get("/prediction/:symbol", async (req, res) => {
    const rawSymbol = req.params.symbol.toUpperCase();

    try {
        const flaskSymbol = rawSymbol.endsWith('.BO') ? rawSymbol : `${rawSymbol}.BO`;
        const response = await axios.get(`http://localhost:5000/predict/${flaskSymbol}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error contacting Flask server:", error.message);
        res.status(500).json({ error: "Failed to get prediction from Flask API" });
    }
});
