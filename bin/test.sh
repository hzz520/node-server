#!/bin/sh
cd $(dirname "$0")
cd ../static/introduce
md2html2pdf --pdf ./index.md --template ./template.html 