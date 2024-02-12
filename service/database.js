const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@cluster0.x6lnqed.mongodb.net`;
const client = new MongoClient(url);
const db = client.db('GameChanger');
const gameCollection = db.collection('BoardGames');
const empCollection = db.collection("Employees");
const foodCollection = db.collection("Food");

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

// Get an employee from the database by their email
function getEmp(email) {
  return empCollection.findOne({ email: email });
}
// Get an employee from the database by their auth cookie
function getEmpByToken(token) {
  return empCollection.findOne({ token: token });
}
  
// Add a new employee to the database
async function createEmp(lastName, firstName, email, password, role) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);
  
  const employee = {
    lastName: lastName,
    firstName: firstName,
    email: email,
    password: passwordHash,
    role: role,
    token: uuid.v4(),
  };
  await empCollection.insertOne(employee);

  return employee;
}

// Add a new game to the database if there is not already a game with the same name
async function addGame(game) {
  await gameCollection.updateOne({name: game.name}, {$setOnInsert: game}, {upsert: true})
}

// Get all the games from the database
function getGames() {
  const cursor = gameCollection.find().sort({"name": 1})
  return cursor.toArray()
}

async function removeGame(game) {
  await gameCollection.deleteOne(game);
}

// Add a new food item to the database if there is not already a food with the same name
async function addFood(food) {
  await foodCollection.updateOne({name: food.name}, {$setOnInsert: food}, {upsert: true})
}

// Get all the food items from the database
function getFood() {
  const cursor = foodCollection.find().sort({"name": 1})
  return cursor.toArray()
}


async function removeFood(food) {
  await foodCollection.deleteOne(food);
}

module.exports = {
  getEmp,
  getEmpByToken,
  createEmp,
  addGame,
  getGames,
  removeGame,
  getFood,
  addFood,
  removeFood
};