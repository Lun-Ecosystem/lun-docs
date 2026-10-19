import { expect, test } from 'vitest';
import { name } from './index.ts';

test('exposes the project id', () => {
  expect(name).toBe('<id>');
});
