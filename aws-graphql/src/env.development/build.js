const _ = require("lodash");
var appRoot = require("app-root-path");

var fs = require("fs");
var { promisify } = require("util");
var writeFile = promisify(fs.writeFile);
var readFile = promisify(fs.readFile);

var env = {};

var compile = async () => {
  /**
   * Node Default
   */
  _.each(process.env, (value, key) => {
    env[key.toUpperCase()] = value;
  });

  /**
   * Custom
   */
  try {
    var data = await readFile(
      appRoot.path + "/src/env.development/.env",
      "utf-8"
    );
  } catch (err) {
    console.log(err);
  }

  if (data !== null && data !== "") {
    data.split("\n").forEach(function (line) {
      var item = line.split("=");
      env[item[0]] = item[1];
    });
  }

  /**
   * Dynamic
   */
  env["ABSPATH"] = appRoot.path;

  /**
   * Create File
   */
  let output = "";
  _.each(env, (value, key) => {
    output += key + "=" + value + "\n";
  });

  try {
    await writeFile(appRoot.path + "/.env.development", output);
  } catch (err) {
    console.log(err);
  }
};

compile();
