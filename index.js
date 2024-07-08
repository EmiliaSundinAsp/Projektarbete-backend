const express = require('express');
const mongoose = require('mongoose');
const Channel = require('./models/channel.model');

const connectString = 'mongodb+srv://emiliasundinasp:fågel-fisk-mittimellan@backend-chat-app.mkvm9ci.mongodb.net/chat-api?retryWrites=true&w=majority';

const app = express(); // Skapa en express-applikation
app.use(express.json()); // Middleware för att tillåta json i express

app.get('/', function (req, res) {
	res.send('Hello World')
})

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