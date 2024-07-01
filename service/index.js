const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = "token";

// Use port 8080 for the backend unless specified on the command line
const port = process.argv.length > 2 ? process.argv[2] : 8080;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('build'));
app.set('trust proxy', true);

// Create an api router that uses the /api path
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get Auth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getEmp(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token)
      res.send({ id: user.email });
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

// Get employee information from the /api/user/:email path
secureApiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getEmp(req.params.email);
  if (user) {
    const token = req?.cookies.token;
    res.send({ first: user.firstName, last: user.lastName, email: user.email, role: user.role, authenticated: token === user.token, rated: user.rated });
  }
  else {
    res.status(404).send({ msg: 'Unknown' });
  }
});

secureApiRouter.get('/user', async (req, res) => {
  const allUsers = await DB.getAllEmps();
  const info = allUsers.map((user) => ({last: user.lastName, first: user.firstName, email: user.email}));
  res.send(info)
});

secureApiRouter.delete('/user', async (req, res) => {
  const user = await DB.getEmp(req.body.email);
  if (user.role !== "super-admin") {
    await DB.removeUser(user);
    const allUsers = await DB.getAllEmps();
    const info = allUsers.map((user) => ({last: user.lastName, first: user.firstName, email: user.email}));
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
  if (await DB.getEmp(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createEmp(req.body.last, req.body.first, req.body.email, req.body.password, req.body.role);
    res.send({
      id: user.email,
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

secureApiRouter.get('/whoami', async (req, res) => {
  const user = await DB.getEmpByToken(req.cookies[authCookieName]);
  const toSend = {name: user.firstName, role: user.role, rated: user.rated}
  res.send(toSend);
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
  console.log(food)
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

// 404 error if the path is unknown
app.use((_req, res) => {
  res.status(404).send({msg: "page not found"});
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    // secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 2*60*60*1000 // two hours
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});