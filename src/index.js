#!/usr/bin/env node

//debug
//console.log("console.log output")
// var shell = require("shelljs");
//
// shell.exec("echo shell.exec works");

const mochaRun = require('./mocha-run');

const fworks = {
    mocha: mochaRun
};

const fwork = process.argv[2];
exports.module = fworks[fwork] || "invalid testing framework";

