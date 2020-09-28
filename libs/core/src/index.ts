import { sentenceCase } from 'change-case';

export const HELLO_CAMEL = 'helloWorld';
export const HELLO_SENTENCE = sentenceCase(HELLO_CAMEL);

export * from './another-file';
