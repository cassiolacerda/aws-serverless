const AWS = require("aws-sdk");

const params = process.env.IS_OFFLINE
  ? {
      region: "localhost",
      endpoint: new AWS.Endpoint(`http://localhost:${process.env.DB_PORT}`),
    }
  : {};
const dynamoDb = new AWS.DynamoDB.DocumentClient(params);

function index(req, res) {
  res.json({ message: "API up and running..." });
}

function insert(req, res) {
  const { userId, name } = req.body;

  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: process.env.DB_TABLE_USERS,
    Item: {
      userId: userId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not create user" });
    }
    res.json({ userId, name });
  });
}

function findOne(req, res) {
  const params = {
    TableName: process.env.DB_TABLE_USERS,
    Key: {
      userId: req.params.userId,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get user" });
    }
    if (!result.Item) {
      res.status(404).json({ error: "User not found" });
    }
    const { userId, name } = result.Item;
    res.json({ userId, name });
  });
}

module.exports = { index, insert, findOne };
