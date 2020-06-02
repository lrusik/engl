const path = require("path");
const fs = require('fs');
const http = require('http');
const https = require('https');
// Certificate
const domain = "ledill.com";

const privateKey = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

require('dotenv').config()

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)
//bot.telegram.sendMessage(process.env.RECEIVER, body)
const express = require('express');
const app = express(); 
const bodyParser = require('body-parser')

// your express configuration here

const httpsServer = https.createServer(credentials, app);


function toHttps(req, res) {
	if(req.protocol !== "https"){
      const fullUrl = 'https://' + req.headers.host + req.url;
      res.redirect(fullUrl);
   }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));

app.post('/api/subscribe', async (req, res) =>  {
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

app.get('*', (req, res) =>  {
	toHttps(req, res);
	res.sendFile(path.join(__dirname, "/index.html"));
});

httpsServer.listen(443);
app.listen(80);