const express = require("express");
const cors = require("cors");
const yahooFinance = require('yahoo-finance2').default;
const app = express()
app.use(cors());
const PORT = process.env.PORT || 4000



app.listen(PORT, () => {
    console.log("server is on!!!!")
})





app.get("/todayprice/:symbol", async (req, res) => {
    const symbol = req.params.symbol + ".BO"; // e.g., RELIANCE => RELIANCE.BO

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



app.get("/prediction", (req, res) => {
    let data = {
        stock_name: "abc",
        today_price: {
            open_price: 10000,
            close_price: 20000
        }

    }
    res.status(201).json(data)

})
