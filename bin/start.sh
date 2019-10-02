#!/bin/sh
if [ - d ./build ] && [ -f ./build/index.js ];then
    if [ ! which pm2 ];then
        cnpm i -g pm2
    fi
    cd './build'
    cnpm i
    if [ lsof -i tcp:8001 ]
        pm2 restart ./index.js
    else
        pm2 restart -n node-server ./index.js
    fi
fi
