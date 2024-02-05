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
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Delete Auth token if stored in a cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
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
})

// Create a secure api router that uses the /api path
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

// Require the user to be logged in to access any endpoints after this point in the code
secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getEmpByToken(authToken);
  if (user) {
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
    res.send({ first: user.firstName, last: user.lastName, email: user.email, role: user.role, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
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

// Add new food at the /api/food endpoint
secureApiRouter.post('/food', async (req, res) => {
  const food = req.body;
  await DB.addFood(food);
  const foods = await DB.getFood();
  res.send(foods);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// 404 error if the path is unknown
app.use((_req, res) => {
  res.status(404).send({message: "page not found"});
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});