// Skapar en model som hanterar alla meddelanden

const mongoose = require('mongoose');

// Skapar ett schema som bestämmer strukturen på ett meddelande
const messageSchema = mongoose.Schema({
	channelName: {
		type: mongoose.Schema.Types.ObjectId, // Har fått hjälp med denna metod att skapa en referens direkt till kanalen som meddelandet tillhör
		ref: 'Channel',
		required: true,
	},
	sender: { // Avsändarens namn
		type: String,
		required: true,
	},
	message: { // Meddelandets innehåll
		type: String,
		required: true,
	}
},
{
	timestamps: true // Lägger till tidpunkt för varje inlägg
}
);

// Skapar en modell som baseras på schemat messageSchema
const Message = mongoose.model('Message', messageSchema);

// Exporterar modellen så den kan användas i andra filer
module.exports = Message;