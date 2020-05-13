"use strict";

const { parseResponseMessage } = require("./libs/utils");

const AWS = require("aws-sdk");

module.exports.hello = async (event) => {
  console.log(process.env);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.invocation = async (event) => {
  console.log(process.env);

  const params = process.env.IS_OFFLINE
    ? {
        endpoint: "http://localhost:3002",
      }
    : {};

  const lambda = new AWS.Lambda(params);

  try {
    const response = await lambda
      .invoke({
        FunctionName: "offline-dev-hello",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: parseResponseMessage(response),
          input: event,
        },
        null,
        2
      ),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify(
        {
          message: err.message,
          input: event,
        },
        null,
        2
      ),
    };
  }
};
