var assert = require('assert');

var ThenFail = require('../bld/thenfail');

var Promise = ThenFail.Promise;

var ThreeCases = require('./helpers/three-cases');

describe('Feature: all', function () {
    it('All fulfilled', function () {
        var promises = [
            new Promise(function (resolve) {
                resolve('a');
            }),
            new Promise(function (resolve) {
                setTimeout(function () {
                    resolve('b');
                }, 10);
            }),
            'c'
        ];
        
        return Promise
            .all(promises)
            .then(function (values) {
                assert.deepEqual(values, ['a', 'b', 'c']);
            });
    });
    
    it('One rejected', function () {
        var error = new Error();
        var count = 0;
        
        var promises = [
            new Promise(function (resolve) {
                count++;
                resolve('a');
            }),
            new Promise(function (resolve) {
                setTimeout(function () {
                    count++;
                    resolve('b');
                }, 10);
            }),
            Promise.reject(error)
        ];
        
        return Promise
            .all(promises)
            .then(undefined, function (reason) {
                // Expecting wait until all promises are either fulfilled or rejected.
                assert.equal(count, 2);
                assert.equal(reason, error);
            });
    });
    
    it('Some rejected', function () {
        var error = new Error();
        var count = 0;
        
        var promises = [
            new Promise(function (resolve) {
                count++;
                resolve('a');
            }),
            new Promise(function (resolve) {
                setTimeout(function () {
                    count++;
                    resolve('b');
                }, 10);
            }),
            new Promise(function (resolve, reject) {
                setTimeout(function () {
                    count++;
                    reject({});
                }, 10);
            }),
            Promise.reject(error)
        ];
        
        return Promise
            .all(promises)
            .then(undefined, function (reason) {
                // Expecting wait until all promises are either fulfilled or rejected.
                assert.equal(count, 3);
                assert.equal(reason, error);
            });
    });
    
    it('Empty promises array', function () {
        return Promise
            .all([])
            .then(function (values) {
                assert.equal(values.length, 0);
            });
    });
});