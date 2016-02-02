'use strict'

const assert = require('assert');
const file = require('../lib/file');

describe('File', () => {
    describe('exists', () => {
        it('this test file exists', () => {
            assert(file.exists(__filename));
        });

        it('a non existant file should not exist', () => {
            assert(!file.exists(__filename + 'blah'));
        });
    });

    describe('readFile', () => {
        it('reads file correctly', () => {
            assert(file.readFile(__filename) != '');
        });
    });
});

