// Skapar en model som hanterar alla användare

const mongoose = require('mongoose');

// Skapar ett schema som bestämmer strukturen på en användare
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	}
});

// Skapar en modell som baseras på schemat userSchema
const User = mongoose.model('User', userSchema);

// Exporterar modellen så den kan användas i andra filer
module.exports = User;