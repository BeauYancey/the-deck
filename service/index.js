const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const nodemailer = require('nodemailer')
const app = express();
const DB = require('./database.js');
const {mail: mailConfig} = require('./config')

const authCookieName = "deck-token";

// Use port 8080 for the backend unless specified on the command line
const port = process.argv.length > 2 ? process.argv[2] : 8080;

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: mailConfig.USER,
    pass: mailConfig.PASS
  }
}

const mailTransporter = nodemailer.createTransport(transport)
mailTransporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('All works fine, congratz!');
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static('build'));
app.set('trust proxy', true);

// Create an api router that uses the /api path
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get Auth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getEmp(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token)
      res.send({ id: user.username });
      return;
    }
    else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  }
  else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Get a list of games from the /api/games endpoint
apiRouter.get('/games', async (req, res) => {
  const games = await DB.getGames();
  res.setHeader('Content-Type', 'application/json');
  res.send(games);
});

// Get a list of food from the /api/food endpoint
apiRouter.get('/food', async (req, res) => {
  const food = await DB.getFood();
  res.setHeader('Content-Type', 'application/json');
  res.send(food);
});

apiRouter.get('/events', async (req, res) => {
  const events = await DB.getEvents();
  res.setHeader('Content-Type', 'application/json');
  res.send(events);
});

apiRouter.get('/setup/:token', async (req, res) => {
  const newEmp = await DB.getEmpByToken(req.params.token)
  if (newEmp && newEmp.password === '') {
    res.send({name: newEmp.name, id: newEmp._id})
  }
  else {
    res.status(400).send({ msg: 'Bad Request' })
  }
})

apiRouter.post('/setup/:token', async (req, res) => {
  const changes = req.body
  const emp = await DB.getEmpByToken(req.params.token)
  const modifiedCount = await DB.editEmp(emp._id, changes)
  if (modifiedCount === 1) {
    setAuthCookie(res, req.params.token)
    res.redirect('/auth')
  }
  else {
    res.status(500).send()
  }
})

// Create a secure api router that uses the /api path
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

// Require the user to be logged in to access any endpoints after this point in the code
secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getEmpByToken(authToken);
  if (user) {
    setAuthCookie(res, user.token) // update auth cookie when user does something -- expires after inactivity
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Get employee information from the /api/user/:username path
secureApiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.getEmp(req.params.username);
  if (user) {
    const token = req?.cookies[authCookieName];
    res.send({ name: user.name, username: user.username, email: user.email, role: user.role, authenticated: token === user.token, rated: user.rated });
  }
  else {
    res.status(404).send({ msg: 'Unknown' });
  }
});

secureApiRouter.put('/user/:username', async (req, res) => {
  const info = req.body.info
  const toChange = await DB.getEmp(req.params.username);
  const editor = await DB.getEmpByToken(req.cookies[authCookieName])
  let password = true // if the user is not updating their password, don't require their old password
  if (req.query.password == 'true') {
    password = await bcrypt.compare(info.oldPassword, toChange.password)
  }
  if (req.query.username == 'true' && await DB.getEmp(info.username)) {
    res.status(409).send({ msg: 'Existing user' });
    return
  }
  if (password && toChange.username === editor.username) { // user is updating their own information
    const {oldPassword, ...changes} = info
    modifiedCount = await DB.editEmp(toChange._id, changes)
    if (modifiedCount !== 1) { // Bad result, nothing changed
      res.status(500).send({msg: `${modifiedCount} users' data modified`})
    }
    else {
      const changed = await DB.getEmp(req.params.username);
      res.send(changed);
    }
  } 
  else if (editor.role === 'admin') { // admin can promote employees to admin and vice versa
    // include logic for promoting employees to admins and vice versa
    // make sure that's the only thing admin's can do
  }
  else {
    res.status(401).send({msg: 'Unauthorized'})
  }
})

secureApiRouter.get('/user', async (req, res) => {
  const allUsers = await DB.getAllEmps();
  const info = allUsers.map((user) => ({name: user.name, username: user.username, email: user.email}));
  res.send(info)
});

secureApiRouter.delete('/user', async (req, res) => {
  const user = await DB.getEmp(req.body.username);
  if (user.role !== "super-admin") {
    await DB.removeUser(user);
    const allUsers = await DB.getAllEmps();
    const info = allUsers.map((user) => ({name: user.name, username: user.username, email: user.email}));
    res.send(info)
  }
  else {
    res.status(401).send({ msg: 'Unauthorized' })
  }
});

// Delete Auth token if stored in a cookie
secureApiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Create a new user at the /api/auth/create endpoint
secureApiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getEmp(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createEmp(req.body.name, req.body.email, req.body.role);
    const sendSuccess = sendWelcome(user)
    if (!sendSuccess) {
      return res.status(500).send({msg: 'Unable to send mail'})
    }

    res.send({
      id: user.token,
    });
  }
});

// Add new game at the /api/games endpoint
secureApiRouter.post('/games', async (req, res) => {
  const game = req.body;
  await DB.addGame(game);
  const games = await DB.getGames();
  res.send(games);
});

secureApiRouter.put('/games', async (req, res) => {
  const {_id, ...game} = req.body.game;
  const query = req.query;
  const user = await DB.getEmpByToken(req.cookies[authCookieName]);
  if (query.type === 'rate') {
    if (user.rated.includes(_id)) {
      res.status(403).send({msg: 'You have already rated this game'});
      return
    }
    else {
      DB.addRatedGame(user._id, _id)
    }
  }
  const numAffected = await DB.updateGame(_id, game);
  if (numAffected > 1) {
    res.status(400).send({msg: `Bad request, update affected ${numAffected} documents`});
    return;
  }
  const games = await DB.getGames();
  res.send(games)
});

// Delete a game at the /api/games endpoint
secureApiRouter.delete('/games', async (req, res) => {
  const game = req.body;
  await DB.removeGame(game);
  const games = await DB.getGames();
  res.send(games);
});

// Add new food at the /api/food endpoint
secureApiRouter.post('/food', async (req, res) => {
  const food = req.body;
  await DB.addFood(food);
  const foods = await DB.getFood();
  res.send(foods);
});

secureApiRouter.put('/food', async (req, res) => {
  const {_id, ...food} = req.body.food;
  const numAffected = await DB.updateFood(_id, food);
  if (numAffected > 1) {
    res.status(400).send({msg: `Bad request, update affected ${numAffected} documents`});
  } else {
    const allFood = await DB.getFood();
    res.send(allFood)
  }
});

//Delete a food item at the /api/food endpoint
secureApiRouter.delete('/food', async (req, res) => {
  const food = req.body;
  await DB.removeFood(food);
  const foods = await DB.getFood();
  res.send(foods);
});

secureApiRouter.post('/events', async (req, res) => {
  let event = req.body;
  event.date = new Date(event.date);
  await DB.createEvent(event);
  const foods = await DB.getEvents();
  res.send(foods);
});

secureApiRouter.delete('/events', async (req, res) => {
  const event = req.body;
  await DB.removeEvent(event);
  const events = await DB.getEvents();
  res.send(events);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, msg: err.message });
});

// Return index.html if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'build' });
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    // secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 2*60*60*1000 // two hours
  });
}

function sendWelcome(recipient) {
  const link = 'https://thedeck.yanceydev.com/setup/' + recipient.token
  const mail = {
    from: mailConfig.USER,
    to: recipient.email,
    subject: 'Welcome to The Deck',
    html: `<h3>Hi ${recipient.name.split(' ')[0]}! Let's set up your account.</h3>
            <p>Click on <a href="${link}">this link<a> or go to ${link} to create a username and password for your account at The Deck.</p>
            <p>Please report any issues setting up your account to your manager or by responding to this email.</p>`
  }

  const sendFailure = mailTransporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err)
      return true
    }
  }) 

  if (sendFailure) {
    return false
  }
  else {
    return true
  }
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});