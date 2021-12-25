to deploy:
npm install -g pm2
npm install -g serve


pm2 serve build 3000 --name='frontServer'

to stop: pm2 stop frontServer
