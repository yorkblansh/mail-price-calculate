const app = require('express')();
const git = require('simple-git')();
const CronJob = require('cron').CronJob; 

 

console.log('Before job instantiation'); 

const job = new CronJob('0 */1 * * * *', function() { 

// results in 'git pull origin master --no-rebase'
    git.pull('origin', 'master', {'--no-rebase': null})

});
console.log('After job instantiation'); 
job.start(); 

