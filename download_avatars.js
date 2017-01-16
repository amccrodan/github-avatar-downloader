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
    cb(error, JSON.parse(body));
  });
}


function downloadImageByURL(url, filePath) {

  if (!fs.existsSync('./avatars')) {
    fs.mkdirSync('./avatars');
  }

  request.get(url)
   .on('error', function (err) {
     throw err;
   })
   .pipe(fs.createWriteStream(filePath));
}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  for (var i = 0; i < result.length; i++) {
    console.log(result[i].avatar_url);
  }

});

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
