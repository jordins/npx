'use strict'

const test = require('tap').test

const parseArgs = require('../parse-args.js')

test('parses basic command', t => {
  const parsed = parseArgs(['/node', '/npx', 'foo'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'foo@latest')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, [])
  t.done()
})

test('parses command with version', t => {
  const parsed = parseArgs(['/node', '/npx', 'foo@1.2.3'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'foo@1.2.3')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, true)
  t.done()
})

test('parses command opts', t => {
  const parsed = parseArgs(['/node', '/npx', 'foo', 'a', 'b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'foo@latest')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('parses scoped package command opts', t => {
  const parsed = parseArgs(['/node', '/npx', '@user/foo', 'a', 'b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, '@user/foo@latest')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('ignores options after command', t => {
  const parsed = parseArgs(['/node', '/npx', 'foo', '-p', 'bar', 'a', 'b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'foo@latest')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['-p', 'bar', 'a', 'b'])
  t.done()
})

test('assumes unknown args before cmd have values and ignores them', t => {
  const parsed = parseArgs(['/node', '/npx', '-p', 'bar', '--blahh', 'arg', '--ignore-existing', 'foo', 'a', 'b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'bar@latest')
  t.equal(parsed.packageRequested, true)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('parses package option', t => {
  const parsed = parseArgs(['/node', '/npx', '-p', 'bar', 'foo', 'a', 'b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'bar@latest')
  t.equal(parsed.packageRequested, true)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('parses package option', t => {
  const parsed = parseArgs(['/node', '/npx', '-p', 'bar', 'foo', 'a', 'b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'bar@latest')
  t.equal(parsed.packageRequested, true)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('parses -c', t => {
  const parsed = parseArgs(['/node', '/npx', '-c', 'foo a b'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'foo@latest')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('uses -p even with -c', t => {
  const parsed = parseArgs(['/node', '/npx', '-c', 'foo a b', '-p', 'bar'])
  t.equal(parsed.command, 'foo')
  t.equal(parsed.package, 'bar@latest')
  t.equal(parsed.packageRequested, true)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('-p prevents command parsing', t => {
  const parsed = parseArgs(['/node', '/npx', '-p', 'pkg', 'foo@1.2.3', 'a', 'b'])
  t.equal(parsed.command, 'foo@1.2.3')
  t.equal(parsed.package, 'pkg@latest')
  t.equal(parsed.packageRequested, true)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('-- stops option parsing but still does command', t => {
  const parsed = parseArgs(['/node', '/npx', '--', '-foo', 'a', 'b'])
  t.equal(parsed.command, '-foo')
  t.equal(parsed.package, '-foo@latest')
  t.equal(parsed.packageRequested, false)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})

test('-- still respects -p', t => {
  const parsed = parseArgs(['/node', '/npx', '-p', 'bar', '--', '-foo', 'a', 'b'])
  t.equal(parsed.command, '-foo')
  t.equal(parsed.package, 'bar@latest')
  t.equal(parsed.packageRequested, true)
  t.equal(parsed.cmdHadVersion, false)
  t.deepEqual(parsed.cmdOpts, ['a', 'b'])
  t.done()
})