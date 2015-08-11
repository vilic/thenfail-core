var assert = require('assert');

var ThenFail = require('../bld/thenfail');

var Promise = ThenFail.Promise;

var ThreeCases = require('./helpers/three-cases');

describe('Feature: tap', function () {
    it('Should relay the value', function () {
        return Promise
            .true
            .tap(function (value) {
                assert.equal(value, true);
            })
            .tap(function (value) {
                assert.equal(value, true);
                return new Promise(function (resolve) {
                    setTimeout(resolve, 10);
                });
            })
            .then(function (value) {
                assert.equal(value, true);
            });
    });
    
    it('Should be in the chain', function (done) {
        Promise
            .true
            .tap(function (value) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 10);
                });
            })
            .tap(function (value) {
                return Promise.delay(10);
            })
            .then(function (value) { })
            .then(undefined, function () {
                done();
            });
    });
});