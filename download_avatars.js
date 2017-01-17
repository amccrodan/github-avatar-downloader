var request = require('request');
var fs = require('fs');
var get_contrib = require('./get-contributors');

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
  console.log('Please enter exactly 2 arguments, in the form <owner> <repo>.');
  process.exit();
}


// Call the main function with command line input
get_contrib.getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
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

