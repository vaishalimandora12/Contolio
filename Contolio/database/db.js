const mongoose=require('mongoose')
mongoose.connect("mongodb://0.0.0.0:27017/CONTOLIO_DB",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("connection successful...."))
.catch((err)=>console.log(err));