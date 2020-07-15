'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { clients } = require('./data/clients')
const { words } = require('./data/words')

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints

  .get('/clients', (req, res) => {
    res.status(200).json({ status: 200, clients: clients });
  })
  
  .get('/clients/:id', (req, res) => {
    clients.forEach(client => {
      if (client.id === req.params.id) {
        res.status(200).json({ status: 200, client: client })
      }
    });
  })

  .post('/clients', (req, res) => {
    if (clients.every(client => {
      return client.email !== req.body.email})) {
        clients.push(req.body);
        res.status(201).json({ status: 201, addedClient: req.body, message: 'success' })
    } else {
      res.status(401).json({ status: 401, error: "user already exists.", message: 'failure'});
    }
      
    })

    .delete('/clients/:id', (req, res) => {
      let deleted = false;
      clients.forEach(client => {
        if (client.id === req.params.id) {
          clients.splice(clients.indexOf(client));
          deleted = true;
          res.status(200).json({ status: 200, deletedClient: client.name, message: 'success'})
        }
      })
      if (deleted === false) {
        res.status(401).json({ status: 401, error: "user not found", message: 'failure'});
      }
    })

    .get('/hangman/word/:id', (req, res) => {
      let notFound = true;
      words.forEach(word => {
        if (word.id === req.params.id) {
          notFound = false;
          res.status(200).json({ word })}
      })
      if (notFound) res.status(401).json({ error: 'word not found' })
    })

    .get('/hangman/word', (req, res) => {
      let rand = Math.round(Math.random()*6);
      const { id, letterCount } = words[rand];
      res.status(200).json({ id, letterCount })
    })

    .get('/hangman/guess/:id/:letter', (req, res) => {
      const wordArr = words[req.params.id-1000].word.split('');
      const guess = wordArr.map(letter => {
        return letter === req.params.letter ? true : false;
      })
      res.status(200).json({ guess });
    })

  .listen(8000, () => console.log(`Listening on port 8000`));
