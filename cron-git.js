const app = require('express')();
const git = require('simple-git')();
const CronJob = require('cron').CronJob; 



console.log('Before job instantiation'); 

const job = new CronJob('0 */3 * * * *', function() { 

git.status();

});
console.log('After job instantiation'); 
job.start(); 
