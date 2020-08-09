# CrossBound
Starbound to Discord chatting and vice versa

## What it does
Starbound chat and Discord chat are typically seperate. This allows you to dedicate a Discord channel to be able to talk to Starbound players in.

## How to install
**Recommended for minimal configuration** Navigate to your Server Directory (or Starbound install if you do not have a dedicated folder for a server)
and create a folder.
* Inside your new folder, run the command `git clone https://github.com/RonanFinley/CrossBound.git` and wait for it to finish.
* Then run the command `npm install` to install the dependancies.

### config.json
* Open up `config.json` in a text editor of your choice (Notepad works fine). We will use this in a moment.
* If you did not follow the first recommended step, that's fine. Just copy absolute path from your "starbound_server.exe" for the "serverPath" in config.json

### Discord Setup
* In Discord, [Enable Developer Mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID).
* In the server you want to use, right click on the channel you want to use and click "Copy ID"
* In `config.json` which you opened earlier, replace `ChannelIDGoesHere` with the ID you just copied. Do not remove the quotes.
* Go to the [Discord Developer Portal](https://discord.com/developers/applications)
* Click on "New Application" on the top right corner
* Name your application whatever you want. Use "CrossBound" if you are feeling uncreative.
* On the leftmost navigation, click on "Bot"
* Click "Add Bot" and click "Yes, Do it!" at the prompt
* If you do not own the server you are planning on using, make sure "Public Bot" is turned on.
* Click "Copy Token".
* In the `config.json` file you opened earlier, replace `BotTokenGoesHere` with the token you copied. Do not remove the quotes.
* Click on "OAuth2" on the leftmost navigation panel in Discord
* Under "Scopes", check "Bot"
* Scroll down and check the permissions "Send Messages" and "Read Message History"
* Scroll back up to "Scopes" and click "Copy Link".
* If you own the server or are otherwise able to add bots, paste the link into your browser to add the bot to the server. **If you do not own the server or cannot invite a bot**, send the link to the owner of the server and have them add it.

### Starbound Setup
* In your Starbound Server Folder, open up the folder "Storage" and open "starbound_server.config" in a text editor of your choice.
* **In starbound_server.config**, set "runRconServer" to `true`.
* **In starbound_server.config**, set "rconServerPassword" to anything you want. **In config.json**, set "rconPass" to the same password.
* **In config.json**, make "port" the same value as **starbound_server.config**'s "rconServerPort"
* Save all files and close them.

### Running
* **DO NOT HAVE THE SERVER RUNNING.** Close the server if it is currently running.
* In the folder you created at the beginning, run the command `npm start`. This will start the server for you. You should be able to log into the server and test the funcitonality.

## Is it compatable with X Mod?
Probably. This program operates on a lower level than mods, so there should not be any interferance. Open an issue if this does not work **with** a mod, but **does work without** that mod.

