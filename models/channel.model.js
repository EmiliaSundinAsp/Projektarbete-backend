// Skapar en model som hanterar alla kanaler

const mongoose = require('mongoose');

// Skapar ett schema som bestämmer strukturen på en kanal
const channelSchema = mongoose.Schema({
	channelName: {
		type: String,
		required: true,
	}
});

// Skapar en modell som baseras på schemat channelSchema
const Channel = mongoose.model('Channel', channelSchema);

// Exporterar modellen så den kan användas i andra filer
module.exports = Channel;