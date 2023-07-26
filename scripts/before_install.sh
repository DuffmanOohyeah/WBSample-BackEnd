#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

yum -y update


export app_root=/home/ec2-user/chatapp
if [ -d "$app_root" ]; then
  rm -rf /home/ec2-user/chatapp
  mkdir -p /home/ec2-user/chatapp
else
  mkdir -p /home/ec2-user
fi
