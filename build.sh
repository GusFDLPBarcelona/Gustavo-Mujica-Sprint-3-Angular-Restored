#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
unset NPM_CONFIG_PREFIX
cd nandovivas
nvm exec 20.19.0 npm run build
