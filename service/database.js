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
  
// Add a new game to the database
function addGame(game) {
  gameCollection.insertOne(game)
}

// Get all the games from the database
function getGames() {
  const cursor = gameCollection.find()
  return cursor.toArray()
}

// Add a new food item to the database
function addFood(food) {
  foodCollection.insertOne(food)
}

// Get all the food items from the database
function getFood() {
  const cursor = foodCollection.find()
  return cursor.toArray()
}

module.exports = {
  getEmp,
  getEmpByToken,
  createEmp,
  addGame,
  getGames,
  getFood,
  addFood
};