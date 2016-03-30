var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  //res.redirect('/');
  res.render('account/logout', {
    title: 'Logout'
  });
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  /* start of HubSpot Forms API code */

  //require Node modules
/*
  var http = require('http');
  var querystring = require('querystring');
  var cookieParser = require('cookie-parser');

  // build the data object

  var postData = querystring.stringify({
      'email': req.body.email,
      'firstname': req.body.first_name,
      'lastname': req.body.last_name,
      'hs_context': JSON.stringify({
          "hutk": req.cookies.hubspotutk,
          "ipAddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          "pageUrl": "http:/localhost:3000",
          "pageName": "Create Account - BigLytics"
      })
  });

  // set the post options, changing out the HUB ID and FORM GUID variables.

  var options = {
  	hostname: 'forms.hubspot.com',
  	path: '/uploads/form/v2/1976760/574e43a5-8825-418d-8415-f62fd8e080f0/submissions',
  	method: 'POST',
  	headers: {
  		'Content-Type': 'application/x-www-form-urlencoded',
  		'Content-Length': postData.length
  	}
  }

  // set up the request

  var request = http.request(options, function(response){
  	console.log("Status: " + response.statusCode);
  	console.log("Headers: " + JSON.stringify(response.headers));
  	response.setEncoding('utf8');
  	response.on('data', function(chunk){
  		console.log('Body: ' + chunk)
  	});
  });

  request.on('error', function(e){
  	console.log("Problem with request " + e.message)
  });

  // post the data

  request.write(postData);
  request.end();
  */
  /* end of HubSpot Forms API code */


  /* Single Send API code goes in here */

   // build the data object
   // TODO: update form to include first and last name
   // TODO: include these dynamic values in the contact properties for the transactional email
   // TODO: try adding from address and reply to address to message part of email

   var postDataJSON = {
      "emailId": 4149502550,
      "message": {
            "to": "daniel.bertschi@ucdconnect.ie"
            },
      "contactProperties": [
            {
                "name": "firstname",
                "value": "Jack"
            },
            {
                "name": "lastname",
                "value": "Bauer"
            },
            {
              "name": "email",
              "value": "daniel@timpanix.com"
            }
      ],
      "customProperties":[
            {
                "name": "custom_property_1",
                "value": "Some value for CP 1"
            },
            {
                "name": "custom_property_2",
                "value": "Some value for CP 2"
            }
      ]
}
/*
//Load the request module
var request = require('request');
var postData = JSON.stringify(postDataJSON);
//var hapikey = '357360bd-c2b3-465c-b422-936f0178d44f';
//var singleSendEndpoint = 'https://api.hubapi.com/email/public/v1/singleEmail/send?hapikey=' + hapikey;

//Lets configure and request
request({
    url: 'https://api.hubapi.com/email/public/v1/singleEmail/send?hapikey=357360bd-c2b3-465c-b422-936f0178d44f', //URL to hit
    //qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
  //  headers: 'Content-Type': 'application/json',

    json: postDataJSON
    /*{
        field1: 'data',
        field2: 'data'
    }*/
/*
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
}
});
/*

 //var hapikey = '357360bd-c2b3-465c-b422-936f0178d44f';
 //var singleSendEndpoint = 'https://api.hubapi.com/email/public/v1/singleEmail/send?hapikey=' + hapikey;

/* new code based on Forms API node.js code */
/*
var http = require('http');
//var postData = JSON.stringify(postDataJSON);


// set the post options, changing out the HUB ID and FORM GUID variables.

var options = {
  hostname: 'api.hubapi.com',
  path: '/email/public/v1/singleEmail/send?hapikey=357360bd-c2b3-465c-b422-936f0178d44f',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
}

// set up the request

var request = http.request(options, function(response){
  console.log("Status Daniel: " + response.statusCode);
  console.log("Headers Daniel: " + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function(chunk){
    console.log('Body Daniel: ' + chunk)
  });
});

request.on('error', function(e){
  console.log("Problem with request " + e.message)
});

// post the data

request.write(postData);
request.end();
*/





/* end of new code */

var request = require('request');

var options = {
  uri: 'https://api.hubapi.com/email/public/v1/singleEmail/send?hapikey=357360bd-c2b3-465c-b422-936f0178d44f',
  method: 'POST',
  json: {
    "emailId": 4149502550,
    "message": {
          "to": "daniel.bertschi@ucdconnect.ie"
          },
    "contactProperties": [
          {
              "name": "firstname",
              "value": "Jack"
          },
          {
              "name": "lastname",
              "value": "Bauer"
          },
          {
            "name": "email",
            "value": "daniel@timpanix.com"
          }
    ],
    "customProperties":[
          {
              "name": "custom_property_1",
              "value": "Some value for CP 1"
          },
          {
              "name": "custom_property_2",
              "value": "Some value for CP 2"
          }
    ]
  }
};

request(options, function (error, response, body) {
  console.log("statusCode Daniel: " + response.statusCode);
  console.log("response Daniel: " + response.statusText);
  response.setEncoding('utf8');
  response.on('data', function(chunk){
    console.log('Body Daniel: ' + chunk);
  });
  /*if (!error && response.statusCode == 200) {
    console.log(body) // Print the shortened url.
  }*/
});

/*
// fire request
var request = require("request");
request({
    url: 'https://api.hubapi.com/email/public/v1/singleEmail/send?hapikey=357360bd-c2b3-465c-b422-936f0178d44f',
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json"
    },
    body: postDataJSON
}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else {
            console.log("error: " + error);
            console.log("statusCode Daniel: " + response.statusCode);
            console.log("response Daniel: " + response.statusText);
            response.setEncoding('utf8');
           	response.on('data', function(chunk){
           		console.log('Body Daniel: ' + chunk);
           	});
        }
    });

*/


  /* End of Single Send API code */


  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });



}; // end of exports.postSignup function

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.profile.company = req.body.company || '';
    user.profile.job = req.body.job || '';
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });
    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            if (err) {
              return next(err);
            }
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },

    //////////////// start here with transactional email stuff ////////////////////////////
    // password reset email //

    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Your Hackathon Starter password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },

    //////////////// start here with transactional email stuff ////////////////////////////
    // password forgot email //

    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hello@biglytics.net',
        subject: 'Reset your password on Hackathon Starter',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot');
  });
};
