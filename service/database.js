const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const {db: config} = require('./config')

const url = `mongodb+srv://${config.username}:${config.password}@cluster0.x6lnqed.mongodb.net`;
const client = new MongoClient(url);
const db = client.db('GameChanger');
const gameCollection = db.collection('BoardGames');
const empCollection = db.collection("Employees");
const foodCollection = db.collection("Food");
const eventCollection = db.collection("Events");

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

// Get an employee from the database by their email
async function getEmp(username) {
  return await empCollection.findOne({ username: username });
}
// Get an employee from the database by their auth cookie
async function getEmpByToken(token) {
  return await empCollection.findOne({ token: token });
}

async function getAllEmps() {
  return await empCollection.find().sort({"firstName": 1}).toArray();
}

async function removeUser(user) {
  await empCollection.deleteOne(user);
}
  
// Add a new employee to the database
async function createEmp(name, email, role) {
  const employee = {
    name: name,
    username: '',
    email: email,
    password: '',
    role: role,
    token: uuid.v4(),
    rated: []
  };
  await empCollection.insertOne(employee);

  return employee;
}

async function editEmp(id, changes) {
  if (changes.password) {
    const passwordHash = await bcrypt.hash(changes.password, 10)
    changes.password = passwordHash
  }
  const res = await empCollection.updateOne({_id: id}, {$set: changes})
  return res.modifiedCount;
}

async function addRatedGame(user_id, game_id) {
  await empCollection.updateOne({_id: user_id}, {$push : {rated: new ObjectId(game_id)}})
}

// Add a new game to the database if there is not already a game with the same name
async function addGame(game) {
  await gameCollection.updateOne({name: game.name}, {$setOnInsert: game}, {upsert: true})
}

// Get all the games from the database
async function getGames() {
  const cursor = await gameCollection.find().sort({"name": 1})
  return cursor.toArray()
}

async function updateGame(id, game) {
  const res = await gameCollection.updateOne({_id: new ObjectId(id)}, {$set: game})
  return res.modifiedCount;
}

async function removeGame(game) {
  await gameCollection.deleteOne(game);
}

// Add a new food item to the database if there is not already a food with the same name
async function addFood(food) {
  await foodCollection.updateOne({name: food.name}, {$setOnInsert: food}, {upsert: true})
}

// Get all the food items from the database
async function getFood() {
  const cursor = await foodCollection.find().sort({"name": 1})
  return cursor.toArray()
}

async function updateFood(id, food) {
  const res = await foodCollection.updateOne({_id: new ObjectId(id)}, {$set: food})
  return res.modifiedCount;
}

async function removeFood(food) {
  await foodCollection.deleteOne(food);
}

async function createEvent(event) {
  await eventCollection.insertOne(event);
}

async function getEvents() {
  const cursor = await eventCollection.find({"date": {$gt: new Date()}}).sort({"date": 1})
  return cursor.toArray()
}

async function removeEvent(event) {
  await eventCollection.deleteOne(event)
}

async function cleanupEvents() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  await eventCollection.deleteMany({"date": {$lt: oneWeekAgo}})
}


module.exports = {
  getEmp,
  getEmpByToken,
  createEmp,
  getAllEmps,
  editEmp,
  addRatedGame,
  removeUser,
  addGame,
  getGames,
  updateGame,
  removeGame,
  addFood,
  getFood,
  updateFood,
  removeFood,
  createEvent,
  getEvents,
  removeEvent
};