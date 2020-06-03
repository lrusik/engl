const path = require("path");
const fs = require('fs');
require('dotenv').config()

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)
//
const express = require('express');
const app = express(); 
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/subscribe', async (req, res) =>  {
	console.log(req.body.name, req.body.phone);
	if(!req.body.name || !req.body.phone) {
		return res.status(400).send('Something broke!');
	}

	const message = "Имя: " + req.body.name + "\n" + "Телефон: " + req.body.phone + "\n" + "Сервис: " + req.body.service + "\n\n" + "Сообщение: " + req.body.message;

	try {
  		await bot.telegram.sendMessage(process.env.RECEIVER, message)
		console.log(req.body);
		res.sendStatus(200);
	} catch (err) {
  		console.log(err)
		res.sendStatus(500);
	}
});

app.get('/', (req, res) =>  {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(80, () => {
	console.log("Hello");
});

