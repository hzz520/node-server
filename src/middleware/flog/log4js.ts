/**
 *
 * 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
 * 背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
 *console.log('\033[42;30m DONE \033[40;32m Compiled successfully in 19987ms\033[0m')
 * */


function isOnline() {
    return process.env['WCloud_Env'] == 'Product'
}

function log(type, sys, ...args) {
    var myc = "\x1B[0;32m"
    if (type == 'DEBUG') {
        myc = "\x1B[0;33m"
    } else if (type == 'ERROR') {
        myc = "\x1B[0;31m"
    }
    var time = `[${new Date().toLocaleString()}]`;
    var msg = myc +time + myc + " "+type + " "+myc + sys
    console.log(msg, '\x1B[0m-', ...args)
}


class Log4js {
    private category: string;
    private isOnline: boolean = false;

    constructor(category: string, level?: string) {
        this.category = category;
        this.isOnline = isOnline();
    }

    log(...arg) {
        log('INFO', this.category, ...arg)
    }

    err(...arg) {
        log('ERROR', this.category, ...arg)
    }

    debug(...arg) {
        if (!this.isOnline) {
            log('DEBUG', this.category, ...arg)
        }
    }

}


export default Log4js;
