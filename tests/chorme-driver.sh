#!/usr/bin/env bash
pkill chromedriver
nohup /usr/lib/chromium-browser/chromedriver --url-base=wd/hub/ --verbose -log-path=./chrome-driver-log.log &
