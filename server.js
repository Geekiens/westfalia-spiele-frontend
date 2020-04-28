var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectId;

var GAMES_COLLECTION = 'games';

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + '/dist/';
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log('Database connection ready');

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log('App now running on port', port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({ error: message });
}

app.get('/api/games', function (req, res) {
  db.collection(GAMES_COLLECTION)
    .find({})
    .toArray(function (err, games) {
      if (err) {
        handleError(res, err.message, 'Failed to get games.');
      } else {
        res.status(200).json(games);
      }
    });
});

app.post('/api/games', function (req, res) {
  var newGame = req.body;

  if (!req.body.name) {
    handleError(res, 'Invalid user input', 'Must provide a name.', 400);
  } else {
    db.collection(GAMES_COLLECTION).insertOne(newGame, function (err, doc) {
      if (err) {
        handleError(res, err.message, 'Failed to create new game.');
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

app.put('/api/games/:id', function (req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  // updateDoc._id = req.params.id;
  console.log(updateDoc);
  db.collection(GAMES_COLLECTION).deleteOne({ _id: new ObjectId(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, 'Failed to update game');
    } else {
      var newGame = req.body;
      db.collection(GAMES_COLLECTION).insertOne(newGame, function (err, doc) {
        if (err) {
          handleError(res, err.message, 'Failed to create new game.');
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  });

  app.get('/api/games/:id/commit', function (req, res) {
    var username = req.params.username;
    db.collection(GAMES_COLLECTION).findOne({ _id: new ObjectId(req.params.id) }, function (err, doc) {
      if (err) {
        handleError(res, err.message, 'Failed to add commit');
      } else {
        var updateDoc = doc;
        delete updateDoc._id;

        db.collection(GAMES_COLLECTION).deleteOne({ _id: new ObjectId(req.params.id) }, function (err, result) {
          if (err) {
            handleError(res, err.message, 'Failed to add commit');
          } else {
            if (!updateDoc.committed) {
              updateDoc.committed = ['username'];
            } else {
              updateDoc.committed.push('username');
            }
            db.collection(GAMES_COLLECTION).insertOne(updateDoc, function (err, doc) {
              if (err) {
                handleError(res, err.message, 'Failed to add commit');
              } else {
                res.status(201).json(doc.ops[0]);
              }
            });
          }
        });
      }
    });
  });

  app.get('/api/games/:id/uncommit/:username', function (req, res) {
    var username = req.params.username;
    db.collection(GAMES_COLLECTION).findOne({ _id: new ObjectId(req.params.id) }, function (err, doc) {
      if (err) {
        handleError(res, err.message, 'Failed to remove commit');
      } else {
        var updateDoc = doc;
        delete updateDoc._id;

        db.collection(GAMES_COLLECTION).deleteOne({ _id: new ObjectId(req.params.id) }, function (err, result) {
          if (err) {
            handleError(res, err.message, 'Failed to remove commit');
          } else {
            const index = updateDoc.committed.indexOf(username);
            if (index > -1) {
              updateDoc.committed.splice(index, 1);
            }

            db.collection(GAMES_COLLECTION).insertOne(updateDoc, function (err, doc) {
              if (err) {
                handleError(res, err.message, 'Failed to remove commit');
              } else {
                res.status(201).json(doc.ops[0]);
              }
            });
          }
        });
      }
    });
  });

  var updateDoc = req.body;
  delete updateDoc._id;
  // updateDoc._id = req.params.id;
  console.log(updateDoc);
  db.collection(GAMES_COLLECTION).deleteOne({ _id: new ObjectId(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, 'Failed to update game');
    } else {
      var newGame = req.body;
      db.collection(GAMES_COLLECTION).insertOne(newGame, function (err, doc) {
        if (err) {
          handleError(res, err.message, 'Failed to create new game.');
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  });
  /*
    db.collection(GAMES_COLLECTION).updateOne({ _id: new ObjectId(req.params.id) }, updateDoc, function (err, doc) {
      if (err) {
        handleError(res, err.message, 'Failed to update game with ID' + doc._id);
      } else {
        res.status(200).json(doc);
      }
    });
    *
     */
});

app.delete('/api/games/:id', function (req, res) {
  db.collection(GAMES_COLLECTION).deleteOne({ _id: new ObjectId(req.params.id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, 'Failed to delete game');
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
