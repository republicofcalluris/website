const { Client, GatewayIntentBits } = require('discord.js');
const { exec } = require('node:child_process');
const path = require('node:path');
const fs = require("node:fs")
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const ALLOWED_ROLE_ID = '1393458067378798592';
const DEPLOY_COMMAND = '!deploywebsite';

let isDeploying = false;

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(DEPLOY_COMMAND)) return;

    try {
        const member = await message.guild.members.fetch(message.author.id);
        const hasRequiredRole = member.roles.cache.has(ALLOWED_ROLE_ID);

        if (!hasRequiredRole) {
            await message.reply('❌ You do not have permission to use this command. Required role is missing.');
            return;
        }

        if (isDeploying) {
            await message.reply('⚠️ A deployment is already in progress. Please wait for it to complete.');
            return;
        }

        isDeploying = true;

        const deployMessage = await message.reply('🚀 Starting deployment...');

        const deployScriptPath = path.join(__dirname, 'deploy.sh');
        
        exec(deployScriptPath, { 
            cwd: __dirname,
            timeout: 300000
        }, async (error, stdout, stderr) => {
            try {
                isDeploying = false;

                if (error) {
                    console.error('Deployment error:', error);
                    await deployMessage.edit(`❌ Deployment failed!`);
                    return;
                }

                await deployMessage.edit(`✅ Deployment completed successfully!`);
                
            } catch (editError) {
                console.error('Error editing message:', editError);
                isDeploying = false;
            }
        });

    } catch (error) {
        console.error('Error processing command:', error);
        isDeploying = false;
        await message.reply('❌ An error occurred while processing the command.');
    }
});

client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});


client.login(process.env.BOT_TOKEN);
