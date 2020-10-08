import { sentenceCase } from 'change-case';
import { YAY } from './another';

export const HELLO_CAMEL = 'helloWorld';
export const HELLO_SENTENCE = sentenceCase(HELLO_CAMEL);

export { YAY };
