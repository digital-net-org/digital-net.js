export const flags = {};
for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) flags[match[1]] = match[2];
}

const { 'base-url': baseUrl, login, password } = flags;
if (!baseUrl || !login || !password) {
    console.error('Usage: node playbook.*.mjs --base-url=<url> --login=<login> --password=<password>');
    process.exit(1);
}
