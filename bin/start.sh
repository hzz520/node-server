#!/bin/sh
if [ - d /opt/node-server/build ] && [ -f /opt/node-server/index.js ];then
    if [ ! which pm2 ];then
        cnpm i -g pm2
    fi
    cd '/opt/node-server/build'
    cnpm i
    if [ lsof -i tcp:8001 ];then
        pm2 restart "./index.js"
        :
    else
        pm2 restart -n node-server "./index.js"
    fi
fi