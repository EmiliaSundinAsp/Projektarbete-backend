const express = require('express');
const mongoose = require('mongoose');
const Channel = require('./models/channel.model');
const Message = require('./models/message.model');

const connectString = 'mongodb+srv://emiliasundinasp:fågel-fisk-mittimellan@backend-chat-app.mkvm9ci.mongodb.net/chat-api?retryWrites=true&w=majority';

const app = express(); // Skapa en express-applikation
app.use(express.json()); // Middleware för att tillåta json i express

app.get('/', function (req, res) {
	res.send('Hello World')
})

// Hämtar alla kanaler
app.get('/api/channel/', async (req, res) => {
	try {
		const channels = await Channel.find({});
		res.json(channels);
	}
	catch (error) {
		res.json({ error: error.message});
	}
});

// Skapar en ny kanal
app.put('/api/channel/', async (req, res) => {
	const { channelName } = req.body; // Hämta channelName från body-objektet till en variabel
	try {
		const channel = await Channel.create({ channelName: channelName});
		res.json(channel);
	}
	catch (error) {
		res.json({ error: error.message});
	}
});

// Skapa meddelande i en befintlig kanal
app.post('/api/channel/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const channel = await Channel.findById(id)
		if (!channel) {
			res.json({ error: 'Channel not found'}).status(404)
		}
		else {
			const message = await Message.create({ channelName: id, ...req.body }) // ... kopierar ett objekt och skickar det vidare (spread operator)
			res.json(message).status(201)
		}
	}
	catch (error) {
		res.json({ error: error.message}).status(500)
	}
});

// Hämta alla meddelanden i en befintlig kanal
app.get('/api/channel/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const channel = await Channel.findById(id) // Sök efter kanalens id
		if (!channel) { // Om kanalen ej finns
			res.json({ error: 'Channel not found'}).status(404) // Skicka felmeddelande
		}
		else {
			const messages = await Message.find({ channelName: id }) // Hämtar alla meddelanden i kanalen :id
			res.json(messages).status(200)
		}
	}
	catch (error) {
		res.json({ error: error.message}).status(500)
	}
});

// Skapa meddelande i broadcast-kanalen
app.post('/api/broadcast', async (req, res) => {
	try {
		const channel = await Channel.findOne({ channelName: 'Broadcast'}) // Letar efter kanalen Broadcast och om den hittar den, spara objektet i channel
		if (!channel) {
			res.json({ error: 'Broadcast channel not found'}).status(404)
		}
		else {
			const message = await Message.create({ channelName: channel._id, sender: 'Anonymous', ...req.body }) // Skapa ett meddelande i Broadcast-kanalen med anonym avsändare, skicka vidare meddelandet från body
			res.json(message).status(201)
		}
	}
	catch (error) {
		res.json({ error: error.message}).status(500)
	}
});

// Hämta alla meddelanden i Broadcast-kanalen
app.get('/api/broadcast', async (req, res) => {
	try {
		const channel = await Channel.findOne({ channelName: 'Broadcast'}) // Letar efter kanalen Broadcast och om den hittar den, spara objektet i channel
		if (!channel) { // Om kanalen ej finns
			res.json({ error: 'Broadcast channel not found'}).status(404) // Skicka felmeddelande
		}
		else {
			const messages = await Message.find({ channelName: channel._id }) // Hämtar alla meddelanden
			res.json(messages).status(200)
		}
	}
	catch (error) {
		res.json({ error: error.message}).status(500)
	}
});

// Connect to MongoDB database using Mongoose ODM (Object Data Modeling) library for MongoDB and Node.js
mongoose.connect(connectString)
	.then(() => {
		// Connection successful
		console.log('Connected to database!')
		// Start server on port 3000 after successful connection to database
		app.listen(3000, () => {
			serverStart();
			console.log('Server is running on port 3000!');
		})
})
.catch(() => {
	// Connection failed
	console.log('Database connection failed!')
});

// En funktion som skapar en kanal
function createChannel(name) {
	// Använd modellen channel för att skapa en kanal via mongoose funktion create, modellen channel kräver channelName
	return Channel.create({ channelName: name })
	// Använd then för att console-logga resultatet
	.then(channel => {
		console.log('Created channel: ', channel)
	// Använd catch för att fånga och console-logga fel
	}).catch(error => {
		console.log('Error creating channel: ' , error)
	});
}

async function serverStart() {
	console.log('Running server startup function')
	try {
		// Använd modellen Channel för att hitta kanalen broadcast, om den finns, lagras den i konstanten channel
		const channel = await Channel.findOne({ channelName: 'Broadcast'})
		if (!channel) {
			await createChannel('Broadcast')
		}
		else {
			console.log('Channel broadcast already exists')
		}
	} catch (error) {
		console.log('Error finding or creating channel: ' , error)
	}
}