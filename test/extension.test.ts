import * as assert from 'assert';

import {getTestFnRegex} from '../src/extension';

suite('match regex', () => {
    const describeRegex = getTestFnRegex('describe')

    function testMatches(line: string, expectedTestName: string): void {
        const match = line.match(describeRegex)
        if (expectedTestName) {
            assert(!!match)
            assert.equal(match[1], 'describe')
            assert.equal(match[2], expectedTestName)
        } else {
            assert(!match)
        }
    }

    test('simple case', () => {
        testMatches(`describe('test 1')`, 'test 1')
    })

    test('other quote marks', () => {
        testMatches(`describe('test \'"\`1')`, 'test \'"`1')
    })

    test('extra whitespace', () => {
        testMatches(`     describe('test 1',  `, 'test 1')
    })

    test('matches with .skip, .only', () => {
        testMatches(`describe.skip('test 1')`, 'test 1')
    })

    test('no match when something else is first on the line', () => {
        testMatches(`foo describe('test 1')`, null)
    })

    test('no match when "describe" + something else is first on the line', () => {
        testMatches(`describeFoo('test 1')`, null)
    })

    test('does not match something else', () => {
        testMatches(`foo`, null)
    })

    test('does not match describe somewhere else', () => {
        testMatches(`foo('describe')`, null)
    })

    test('does not match describe called with not a string', () => {
        testMatches(`describe(foo)`, null)
    })
})