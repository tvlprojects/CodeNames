# Overview

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Uses Semantic-UI CSS Framework for custom components, and connected to Firebase, a cloud hosted real time database to synchronize data across multiple clients. Mobile-friendly and features and online and offline mode.

It was created to replicate the [CodeNames](https://czechgames.com/files/rules/codenames-rules-en.pdf) board game.

Primary differences between offline and online mode:
* Online mode uses a form to handle clues
* Online mode asks user to select a role before entering game
* Offline mode allows users to toggle between views
* Offline mode can still be played on multiple screens
* Clues must be stated aloud in offline mode as audience is intended to be together when playing

# Testing
To test the following application:

Visit https://tvlprojects.github.io/CodeNames

OR

1. Run "git clone https://github.com/tvlprojects/CodeNames.git" to add the file to your workspace
2. Go to the directory, and run "npm install"
3. Once completed, run "npm start"

# Screenshots

### Home Page to Select Unique Game Id
![Home Page](https://i.imgur.com/sz1x20F.png)

### Role Selection for Online Games
![Role Selection](https://i.imgur.com/hzUQlND.png)

### Spymaster View
![Spymaster View](https://i.imgur.com/DXMy02i.png)

### Agent View
![Agent View](https://i.imgur.com/BGaoyCn.png)
