import { describe, expect, it } from 'vitest';
import { allModels } from '../data/devices';
import { matchesQuery } from './search';

const find = (q: string) => allModels.filter((r) => matchesQuery(r, q)).map((r) => r.model.name);

describe('model search', () => {
  it('matches English names case-insensitively', () => {
    expect(find('iphone 15 pro')).toEqual(['iPhone 15 Pro Max', 'iPhone 15 Pro']);
  });
  it('matches Hebrew aliases', () => {
    expect(find('אייפון 16e')).toEqual(['iPhone 16e']);
    expect(find('גלקסי s24 ultra')).toEqual(['Galaxy S24 Ultra']);
  });
  it('matches without spaces', () => {
    expect(find('s25ultra')).toContain('Galaxy S25 Ultra');
  });
  it('empty query matches everything', () => {
    expect(find('  ')).toHaveLength(allModels.length);
  });
});
