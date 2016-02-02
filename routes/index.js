'use strict'

const express = require('express');
const router = express.Router();
const fs = require('fs');
const file = require('../lib/file');
const shuffle = require('shuffle-array');

const USR_SHARE_WORDS = '/usr/share/dict/words';
const USR_DICT_WORDS  =  '/usr/dict/words';

let wordListFile = findWordList();
let wordList = [];

function findWordList() {
    if(file.exists(USR_SHARE_WORDS)) {
        return USR_SHARE_WORDS;
    }

    if(file.exists(USR_DICT_WORDS)) {
        return USR_DICT_WORDS;
    }

    throw 'No word list found';
}

function parseFiles(words) {
    let parsedWords = words.split("\n")
        .map((w) => {
            return w.trim();
        })
        .filter((w) => {
            return w.length > 0;
        })
    wordList = shuffle(parsedWords);
}


file.readFile(wordListFile)
    .then(parseFiles)
    .catch((err) => {
        throw 'error loading files';
    });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quickword' });
});

router.get('/words', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(wordList));
});

module.exports = router;
