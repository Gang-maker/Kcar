// Select the database to use.
use('autorizz');

// Show all customers
const customers = db.getCollection('customers').find({}).toArray();
console.log('All customers:', customers);

// Show all cars (if you have a cars collection)
const cars = db.getCollection('cars').find({}).toArray();
console.log('All cars:', cars);

// Count the number of customers
const customerCount = db.getCollection('customers').countDocuments();
console.log(`Total customers: ${customerCount}`);

// Add a new user with a known password (Felix / carvision)
const bcrypt = require('bcrypt');
const password = 'carvision';
const hash = bcrypt.hashSync(password, 12);

db.users.insertOne({
  name: "Felix",
  email: "felix@example.com",
  password: hash
});

console.log('Added user Felix with password carvision');