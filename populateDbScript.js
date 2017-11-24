const Person = require('./models');
const people = require('./people');
const mongoose = require('mongoose');
const connectionString = require('./connection.js');

/* eslint-disable no-console */
mongoose.Promise = global.Promise;
mongoose.connect(connectionString, { useMongoClient: true });
const populate = () => {
  const populatePeople = () => {
    const allPeople = people;
    const promises = allPeople.map(p => new Person(p).save());
    return Promise.all(promises);
  };

  return populatePeople()
    .then(() => Person.count())
    .then(count => console.log('count', count))
    .then(() => {
      console.log('done');
      mongoose.disconnect();
    })
    .catch((err) => {
      console.log('ERROR', err);
      throw new Error(err);
    });
};
populate();
