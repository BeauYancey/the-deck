const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = "token";

const port = 8080;


app.use(express.json());
app.use(cookieParser());
app.use(express.static('build'));
app.set('trust proxy', true);

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Create Auth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getEmp(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createEmp(req.body.last, req.body.first, req.body.email, req.body.password, req.body.role);

    res.send({
      id: user.email,
    });
  }
});

// Get Auth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getEmp(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send({ id: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Delete Auth token if stored in a cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Get employee information
apiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getEmp(req.params.email);
  if (user) {
    const token = req?.cookies.token;
    res.send({ first: user.firstName, last: user.lastName, email: user.email, role: user.role, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

apiRouter.get('/games', async (req, res) => {
  const games = await DB.getGames();
  res.setHeader('Content-Type', 'application/json');
  res.send(games);
});

apiRouter.get('/food', async (req, res) => {
  const food = await DB.getFood();
  res.setHeader('Content-Type', 'application/json');
  res.send(food);
})

  apiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getEmpByToken(authToken);
  if (user) {
    next();
  } else {
    // res.status(401).send({ msg: 'Unauthorized' });
    next();
  }
});

// Add new game
apiRouter.post('/games', async (req, res) => {
  const game = req.body;
  await DB.addGame(game);
  const games = await DB.getGames();
  res.send(games);
});

apiRouter.post('/food', async (req, res) => {
  const food = req.body;
  await DB.addFood(food);
  const foods = await DB.getFood();
  res.send(foods);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'build' });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});