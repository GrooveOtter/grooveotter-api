# grooveotter-api
API Server for GrooveOtter

Setup

```bash
npm install
npm install sqlite3
./node_modules/.bin/knex migrate:latest
# put these in your .bash_profile or .bashrc
export NODE_ENV=development
export GOOGLE_CLIENT_ID=...
export GOOGLE_CLIENT_SECRET=...
export GOOGLE_HOST=http://localhost:9000
export SECRET=12345 # whatever you want
export TWITTER_CONSUMER_KEY=...
export TWITTER_CONSUMER_SECRET=...
export TWITTER_HOST=http://localhost:9000
export LOCATION=http://localhost:8000 # whatever port the front-end server runs on

node server.js
```
