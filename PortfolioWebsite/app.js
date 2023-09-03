const express = require('express');

const bodyParser = require('body-parser');

const { check, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');

const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


//middleware for parsing JSON in request body
app.use(express.json());

app.get('/', (request, response) => {

	response.render('contact', { errors : '' });

});

app.post('/send', 
	[
		check('name').notEmpty().withMessage('Name is required'),
		check('email').isEmail().withMessage('Invalid Email Address'),
		check('subject').notEmpty().withMessage('Subject is required'),
		check('message').notEmpty().withMessage('Message is required')
	], (request, response) => {

		const errors = validationResult(request);

		if(!errors.isEmpty())
		{
			response.render('contact', { errors : errors.mapped() });
		}
		else
		{
			const transporter = nodemailer.createTransport({
				service : 'Gmail',
				auth : {
					user : '@gmail.com',
					pass : ''
				}
			});

			const mail_option = {
				from : request.body.email,
				to : 'rafaghamri@gmail.com',
				subject : request.body.subject,
				text : request.body.message
			};

			transporter.sendMail(mail_option, (error, info) => {
				if(error)
				{
					console.log(error);
				}
				else
				{
					response.redirect('/success');
				}
			});
		}
});

app.get('/success', (request, response) => {

	response.send('<h1>Your Message was Successfully Send!</h1>');

});





app.get('/', function(req, res){
  res.render('contact.ejs', {
        title: 'My Site',
    nav: ['Home','About','Contact'] 
  });
});

app.get('/home', function(req, res){
  res.render('contact.ejs', {
        title: 'My Site',
    nav: ['Home','About','Contact'] 
  });
});

app.get('/about', function(req, res){
  res.render('contact.ejs', {
    title: 'About',
     nav: ['Home','About','Contact']
  });
});

app.get('/contact', function(req, res){
  res.render('contact.ejs', {
    title: 'Contact',
     nav: ['Home','About','Contact']
  });
});




//start server
app.listen(3000, () => {

	console.log('Server started on port 3000');

});

// middleware & static file
app.use(express.static('public'));