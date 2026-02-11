import { mkdirSync, cpSync, existsSync, rmSync } from 'fs';
import { Project, SyntaxKind } from 'ts-morph';

export class Builder {
    static #targetDtsPath = './dist/index.d.ts';
    static #sourcesPath = '../digital-ui/src/**/Dn*.ts';

    #targetDtsFile = null;
    #componentDocs = new Map();
    updateCount = 0;

    #project = new Project({
        skipAddingFilesFromTsConfig: true,
        compilerOptions: {
            allowJs: true,
            noResolve: true,
        },
    });

    buildDistFolder() {
        if (existsSync('./dist')) {
            rmSync('./dist', { recursive: true });
        }
        mkdirSync('./dist');
        cpSync('./src', './dist', { recursive: true });
    }

    async writeJsDoc() {
        this.#getComponentsDoc();
        this.#writeComponentsDoc();
        await this.#targetDtsFile.save();
    }

    #writeComponentsDoc() {
        this.#targetDtsFile = this.#project.addSourceFileAtPath(Builder.#targetDtsPath);
        const reactModule = this.#targetDtsFile.getModule(m => m.getName().includes('react'));

        if (!reactModule) {
            throw new Error(`Could not find react module declaration.`);
        }
        const jsxNamespace = reactModule.getModule('JSX');
        if (!jsxNamespace) {
            throw new Error('Could not find JSX Namespace declaration.');
        }
        const intrinsicInterface = jsxNamespace.getInterface('IntrinsicElements');
        if (!intrinsicInterface) {
            throw new Error('JSX.IntrinsicElements not found.');
        }

        for (const prop of intrinsicInterface.getProperties()) {
            const propName = prop.getName().replace(/['"]/g, '');
            if (this.#componentDocs.has(propName)) {
                const docText = this.#componentDocs.get(propName);
                prop.getJsDocs().forEach(doc => doc.remove());
                prop.addJsDoc({ description: docText });
                this.updateCount++;
            }
        }
    }

    #getComponentsDoc() {
        const sourceFiles = this.#project.addSourceFilesAtPaths(Builder.#sourcesPath);
        for (const file of sourceFiles) {
            for (const cls of file.getClasses()) {
                const tagName = Builder.#getComponentTagName(cls);
                if (tagName && cls.getJsDocs().length > 0) {
                    const jsDocText = cls.getJsDocs()[0].getInnerText();
                    this.#componentDocs.set(tagName, jsDocText);
                }
            }
        }
    }

    static #getComponentTagName(cls) {
        const decorator = cls.getDecorator('customElement');
        if (!decorator) {
            return undefined;
        }
        const args = decorator.getArguments();
        if (args.length > 0 && args[0].getKind() === SyntaxKind.StringLiteral) {
            return args[0].getText().replace(/['"]/g, '');
        }
        return undefined;
    }
}
