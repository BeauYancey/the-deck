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


function getEmp(email) {
  return empCollection.findOne({ email: email });
}
  
function getEmpByToken(token) {
  return empCollection.findOne({ token: token });
}
  
async function createEmp(lastName, firstName, email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);
  
  const employee = {
    lastName: lastName,
    firstName: firstName,
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await empCollection.insertOne(employee);

  return employee;
}
  
function addGame(game) {
  gameCollection.insertOne(game)
}

function getGames() {
  const cursor = gameCollection.find()
  return cursor.toArray()
}

function addFood(food) {
  foodCollection.insertOne(food)
}

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