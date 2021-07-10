const app = require('express')();
const git = require('simple-git')();
const CronJob = require('cron').CronJob; 

console.log(git().status()); 

console.log('Before job instantiation'); 

const job = new CronJob('0 */1 * * * *', function() { 

console.log(git.status());

});
console.log('After job instantiation'); 
job.start(); 
