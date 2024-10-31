require('dotenv').config();  // Load environment variables from .env file
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;  // Accepts exactly 10 digits

// Store user data temporarily
let userData = {};

// Basic command to start the bot
bot.start((ctx) => {
    ctx.reply('Welcome to Techmaa! Please enter your name:');
    userData = {}; // Reset user data
});

// Handle user's name
bot.on('text', (ctx) => {
    if (!userData.name) {
        userData.name = ctx.message.text;
        ctx.reply('Thank you! Please enter your email:');
    } else if (!userData.email) {
        const email = ctx.message.text;
        if (emailRegex.test(email)) {
            userData.email = email;
            ctx.reply('Great! Now, please enter your phone number (10 digits):');
        } else {
            ctx.reply('Invalid email format. Please enter a valid email:');
        }
    } else if (!userData.phone) {
        const phone = ctx.message.text;
        if (phoneRegex.test(phone)) {
            userData.phone = phone;
            ctx.reply('Awesome! What position are you applying for?');
        } else {
            ctx.reply('Invalid phone number format. Please enter a valid 10-digit phone number:');
        }
    } else if (!userData.position) {
        userData.position = ctx.message.text;
        ctx.reply('Please send your resume as a PDF file.');
    }
});

// Handle resume upload
bot.on('document', (ctx) => {
    const fileName = ctx.message.document.file_name;
    if (fileName.endsWith('.pdf')) {
        userData.resume = ctx.message.document.file_id;
        ctx.reply('Thank you! Your application has been submitted successfully.');
        console.log('User Data:', userData);
        // Reset user data
        userData = {};
    } else {
        ctx.reply('Please upload your resume as a PDF file.');
    }
});

// Launch the bot
bot.launch()
    .then(() => console.log('Bot is running...'))
    .catch(err => console.error('Failed to launch bot:', err));
