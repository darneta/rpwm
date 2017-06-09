# rpwm

Rhodecode packagist webhook middleware

# TLTR

Middleware which passes rhodecode repository webhook to packagist for auto packagist update on new commit in repository.

# Run in docker

Check https://github.com/darneta/rpwm-dockerized

# Requirements

* npm
* nodejs

# Config

#### Via env variables
`PACKAGIST_USER` - packagist username  
`PACKAGIST_TOKEN` - packagist API Token  
`WEBHOOK_TOKEN` - Rhodecode webhook "Secret Token"  
`PACKAGIST_URL` - default "https://packagist.org"  
`APP_PORT` - default 80  

# Setup

#### Install

```bash
npm install && npm cache clean --force
```

#### Run

```bash
PACKAGIST_USER=someuser PACKAGIST_TOKEN=secrettoken WEBHOOK_TOKEN=rhodecodesecretoken nodejs script.js
```

