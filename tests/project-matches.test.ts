import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesProject } from '../src/scripts/project-matches.ts';
const project = { title: 'Lucky Twelve', summary: '投幣益智遊戲', category: 'Game', tags: ['JavaScript', 'Canvas'] };
test('search matches title, Chinese summary, and tags case-insensitively', () => {
  for (const query of ['LUCKY', '投幣', 'javascript', ' canvas ']) assert.equal(matchesProject(project, { query, category: '', tags: [] }), true);
  assert.equal(matchesProject(project, { query: 'unknown', category: '', tags: [] }), false);
});
test('selected tags use OR; search, category and tags combine with AND', () => {
  assert.equal(matchesProject(project, { query: 'lucky', category: 'Game', tags: ['Python', 'Canvas'] }), true);
  for (const filters of [
    { query: 'car', category: 'Game', tags: ['Canvas'] },
    { query: 'lucky', category: 'AI / ML', tags: ['Canvas'] },
    { query: 'lucky', category: 'Game', tags: ['Python'] },
  ]) assert.equal(matchesProject(project, filters), false);
});
test('cleared filters restore every project', () => {
  assert.equal(matchesProject(project, { query: '', category: '', tags: [] }), true);
});
