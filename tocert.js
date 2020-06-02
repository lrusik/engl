const express = require('express');

const path = require('path');
const app = express();

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.listen(80, ()=>{
	console.log("Running");
});