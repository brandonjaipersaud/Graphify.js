const express = require('express')
const app = express();

const path = require('path');


// static directory for the files in /pub
app.use(express.static(path.join(__dirname, '/pub')))


app.get('/', function(req, res){
    res.sendFile(__dirname + '/pub/landing.html');
});


const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Listening on port ${port}...`)
})  
  

