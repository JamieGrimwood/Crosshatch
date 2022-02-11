# Crosshatch

Crosshatch is an opensource software that allows controlling docker containers from the web. You can mass start, stop and kill, and you can view each container individually.

## Known Bugs:

EJS send a console error when visiting an unknown container ID, even though it shouldn't be trying to render the page. No impact on dashboard functionality.

## Images:

![Screenshot of dashboard](https://bot-has-a-hissy-fit.uploader.one/uploads/VKQ3e.png)
![Container overview page](https://bot-has-a-hissy-fit.uploader.one/uploads/Bt0c6.png)
![Starting a container](https://bot-has-a-hissy-fit.uploader.one/uploads/ZPC8u.png)
![Dashboard again](https://bot-has-a-hissy-fit.uploader.one/uploads/wHWje.png)

## Todo:
1. Add live updating stats through websockets
2. Make the css nicer
3. Add more features