var request = require('request');
var fs = require('fs');

var GITHUB_USER = "amccrodan";
var GITHUB_TOKEN = "581cc3110dadb29e6abeec829e6beb65f5b422a4";

// Requests a JSON-formatted array of contributors to a certain repo on GitHub
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options, function (error, response, body) {
    if (error) {
      console.log(error);
      return;
    }
    cb(error, JSON.parse(body));
  });
}

// Downloads an image from a specific URL to the given filePath
function downloadImageByURL(url, filePath) {

  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log('Downloaded ' + filePath);
    });
}



// Welcome!
console.log('Welcome to the GitHub Avatar Downloader!');

// Take in command line arguments, ignoring the location of Node and this file
var myArgs = process.argv.slice(2);

// Check to make sure two arguments have been passed in
if (myArgs.length !== 2) {
  throw new Error('Please enter exactly 2 arguments, in the form <owner> <repo>.');
}


// Call the main function with command line input
getRepoContributors(myArgs[0], myArgs[1], function(err, result) {

  // Check to see if avatars directory already exists or not
  if (!fs.existsSync('./avatars')) {
    fs.mkdirSync('./avatars');
  }

  // Loop through each contributor and download their avatar to local folder
  for (var i = 0; i < result.length; i++) {
    var filePath = 'avatars/' + result[i].login + '.jpg';
    downloadImageByURL(result[i].avatar_url, filePath);
  }

});

