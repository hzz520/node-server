#!/bin/sh
if [ -d "/opt/node-server/build" ] && [ -f "/opt/node-server/build/index.js" ];then
    cd '/opt/node-server'
    cnpm i
    if ps -ef|grep mongod;then
        echo 'restart mongod'
        mongod --shutdown
        mongod --auth &
    else
        echo 'start mongod'
        mongod --auth &
    fi
    if lsof -i tcp:8001;then
	    echo 'restart node-server'
        pm2 restart "./build/index.js"
    else
	    echo 'start node-server'
        pm2 start -n node-server -f "./build/index.js"
    fi
else
   echo 'error'
fi
