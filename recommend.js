

// Take in command line arguments, ignoring the location of Node and this file
var myArgs = process.argv.slice(2);

// Check to make sure two arguments have been passed in
if (myArgs.length !== 2) {
  console.log('Please enter exactly 2 arguments, in the form <owner> <repo>.');
  process.exit();
}


// ENV file validation
if (!fs.existsSync('./.env')) {
  console.log('The .env file containing user information does not exist.');
  process.exit();
}

if (!GITHUB_USER || !GITHUB_TOKEN) {
  console.log('Missing username or token in the .env file.');
  process.exit();
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