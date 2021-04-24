#!/bin/bash
EX_PATH="`dirname \"$0\"`"              # relative
EX_PATH="`( cd \"$EX_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$EX_PATH" ] ; then
  # error; for some reason, the path is not accessible
  # to the script (e.g. permissions re-evaled after suid)
  exit 1  # fail
fi
cd "$EX_PATH";
# npm install;
npm run start;
