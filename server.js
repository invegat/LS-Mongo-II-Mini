// / <reference types="mongodb" />

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const server = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

// non-error status code constants
const STATUS_OK = 200;

server.use(bodyParser.json());

// Your API will be built out here.
server.get('/users', (req, res) => {
  Person.find({}, (err, people) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR).json(err);
    } else {
      res.status(STATUS_OK).json(people);
    }
  });
});
server.get('/users/:direction', (req, res) => {
  const direction = req.params.direction;
  console.log('direction', direction);
  let sort = 0;
  switch (direction) {
    case 'asc':
      sort = 1;
      break;
    case 'desc':
      sort = -1;
      break;
    default:
      /* eslint-disable quotes */
      res.status(STATUS_USER_ERROR).json(`direction must be 'asc' or 'desc'`);
      return;
  }
  Person.find().sort({ firstName: sort }).exec((err, people) => {
    if (err) {
      console.log('err:', err);
      res.status(STATUS_SERVER_ERROR).json('find or sort or exec failed');
    } else {
      return res.status(STATUS_OK).json(people);
    }
  });

  /*

  Person.find({}, (err, people) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR).json(err);
    } else {
      res.status(STATUS_OK).json(people.sort({ firstName: 1 }, (sortErr, sortRes) => {
        if (sortErr) {
          console.log('sortErr:', sortErr);
          res.status(STATUS_SERVER_ERROR).json('sort failed');
        } else {
          return sortRes;
        }
      }));
    }
  });
  */
});

server.get('/user-get-friends/:id', (res, req) => {
  const id = res.params.id;
  Person.findById(id).exec((err, person) => {
    if (err) {
      req.status(STATUS_USER_ERROR).json(`id '${id}' not found`);
    } else {
      req.status(STATUS_OK).json(person);
    }
  });
});
server.put('/users/:_id', (res, req) => {
  const _id = res.params._id;
  const { firstName, lastName } = res.query;
  // console.log(`id: ${_id} firstName: ${firstName} lastName: ${lastName}`);
  Person.update({ _id: mongodb.ObjectID(_id) },
    {
      firstName,
      lastName
    },
    { multi: false },
    (err, resp) => {
      if (err) {
        req.status(STATUS_USER_ERROR).json(`_id '${_id}' not found, ${err}`);
        return;
      }
      req.status(STATUS_OK).json('1 row updated');
    }
  );
});
mongoose.Promise = global.Promise;
const connect = mongoose.connect('mongodb://localhost/people', {
  useMongoClient: true
});
/* eslint no-console: 0 */
connect.then(
  () => {
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  (err) => {
    console.log('\n************************');
    console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
    console.log('************************\n');
  }
);
