const express = require("express")
const app = express()
const PORT = process.env.PORT || 4000
const productRouter = require("../routes/productRoutes.js")
const categoryRouter = require("../routes/categoryRoutes.js")
const storeRouter = require("../routes/store.js")


const cors = require("cors")
app.use(cors());
app.use(express.json());


app.use(storeRouter);
app.use(productRouter);
app.use(categoryRouter);




app.get("/" , (req ,res) =>{
res.send("hello server is running fine")
})

app.listen(PORT , ()=>{
    console.log(`http://localhost:${PORT}`)
})