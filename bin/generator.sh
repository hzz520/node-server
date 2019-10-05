#!/bin/sh
cd $(dirname "$0")
cd ../static/jianli
md2html2pdf --pdf ./index.md --template ./template.html 