import { Builder } from './Builder.mjs';

(async () => {
    console.log('Building Digital UI React Types...');
    const builder = new Builder();
    builder.buildDistFolder();

    await builder.writeJsDoc();
    console.log(`Updated ${builder.updateCount} components documentation comments.`);
    console.log('Successfuly built Digital UI React Types.');
})();
