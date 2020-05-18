"use strict";

const AWS = require("aws-sdk");

module.exports.postprocess = (event) => {
  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;
    console.log(
      `New .txt object has been created: ${filename} (${filesize} bytes)`
    );
  });
};

module.exports.webhook = async (event) => {
  const response = {};

  const params = process.env.IS_OFFLINE
    ? {
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
        s3ForcePathStyle: true,
        endpoint: new AWS.Endpoint(`http://localhost:${process.env.S3_PORT}`),
      }
    : {};

  const s3 = new AWS.S3(params);

  await s3
    .upload({
      Bucket: process.env.S3_BUCKET,
      Key: "example.txt",
      Body: new Buffer("Cássio Lacerda"),
    })
    .promise()
    .then(
      function (data) {
        response.statusCode = 201;
        response.message = `File uploaded successfully. ${data.Location}`;
      },
      function (err) {
        response.statusCode = err.statusCode || 500;
        response.message = `Upload failded. ${err.message}`;
      }
    );

  console.log(response.message);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(
      {
        message: response.message,
        input: event,
      },
      null,
      2
    ),
  };
};
