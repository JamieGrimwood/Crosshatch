# Crosshatch

Crosshatch is an opensource software that allows controlling docker containers from the web. You can mass start, stop and kill, and you can view each container individually.

## Features

- Live stats updating
- Ability to control docker containers from the web
- Authentication system

## Known Bugs:

EJS send a console error when visiting an unknown container ID, even though it shouldn't be trying to render the page. No impact on dashboard functionality.

## Todo:
- Make the css nicer
- Add more features
- Make console log to a file each startup so it can be served to the frontend when needed