const express = require('express');
const PORT = process.env.PORT || 3000;
const routes = require('./routes/routes')
const app = express();
app.use(express.json());
app.use(routes); 
app.listen(PORT, ()=>{
	console.log(`Server started at port ${PORT}`);
})