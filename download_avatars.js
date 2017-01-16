var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "amccrodan";
var GITHUB_TOKEN = "581cc3110dadb29e6abeec829e6beb65f5b422a4";

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url : 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent' : "GitHub Avatar Downloader - Student Project"
    }
  }

  request.get(options, function (error, response, body) {
    console.log(error);
    console.log(response.headers['x-ratelimit-remaining']);
    cb(error, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {

  request.get(url)
   .on('error', function (err) {
     throw err;
   })
   .pipe(fs.createWriteStream(filePath));
}

var myArgs = process.argv.slice(2);

if (myArgs.length !== 2) {
  console.log("Please enter exactly 2 arguments, in the form <owner> <repo>.");
  return;
}

getRepoContributors(myArgs[0], myArgs[1], function(err, result) {

  if (!fs.existsSync('./avatars')) {
    fs.mkdirSync('./avatars');
  }

  for (var i = 0; i < result.length; i++) {
    var filePath = 'avatars/' + result[i].login + '.jpg';
    downloadImageByURL(result[i].avatar_url, filePath);
  }

});

