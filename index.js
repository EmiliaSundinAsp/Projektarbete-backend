const express = require('express');
const mongoose = require('mongoose');

const connectString = 'mongodb+srv://emiliasundinasp:fågel-fisk-mittimellan@backend-chat-app.mkvm9ci.mongodb.net/chat-api?retryWrites=true&w=majority';

const app = express(); // Skapa en express-applikation

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
			console.log('Server is running on port 3000!');
		})
})
.catch(() => {
	// Connection failed
	console.log('Database connection failed!')
});