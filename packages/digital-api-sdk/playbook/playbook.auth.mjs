#!/usr/bin/env node

import { flags } from './args.mjs';
import { DigitalApi } from './DigitalApi.mjs';
import { Logger } from './Logger.mjs';

const { 'base-url': baseUrl, login, password } = flags;
const api = new DigitalApi({ baseUrl });

console.log('=== AuthCatalog playbook ===');
console.log(`baseUrl: ${baseUrl}`);
console.log(`login:   ${login}`);

console.log('\n--- [1] auth.login ---');
Logger.logRequest('POST', 'authentication/user/login', { login, password });
const loginResult = await api.catalog.auth.login({ login, password });
console.log('\nResult<string>:');
Logger.logResult(loginResult);

console.log('\n--- [2] auth.logout ---');
Logger.logRequest('POST', 'authentication/user/logout');
const logoutResult = await api.catalog.auth.logout();
console.log('\nResult<null>:');
console.log(Logger.fmt(logoutResult));

console.log('\n=== Done ===');
process.exit(loginResult?.value ? 0 : 1);
