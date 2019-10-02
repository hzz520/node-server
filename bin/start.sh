#!/bin/sh
if [ -d "/opt/node-server/build" ] && [ -f "/opt/node-server/build/index.js" ];then
    if [ ! which pm2 ];then
        cnpm i -g pm2
    fi
    cd '/opt/node-server/build'
    cnpm i
    if [ lsof -i tcp:8001 ];then
	echo 'restart node-server'
        pm2 restart "./index.js"
    else
	echo 'start node-server'
        pm2 start -n node-server "./index.js"
    fi
else
   echo 'error'
fi
