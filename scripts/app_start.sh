#!bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

cd /home/ec2-user/chatapp
pm2 restart ecosystem.config.js
pm2 save
