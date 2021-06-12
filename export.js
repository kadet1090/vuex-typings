const { Project, ts, ModuleDeclarationKind, forEachStructureChild, Structure } = require("ts-morph")

const project = new Project();
const declarationFile = project.createSourceFile("vuex.d.ts", "", { overwrite: true })

const filesToInclude = [
    "./types/actions.ts",
    "./types/mutations.ts",
    "./types/getters.ts",
    "./types/state.ts",
    "./types/modules.ts",
    "./types/store.ts",
    "./types/public.ts",
]

const vuexModuleDeclaration = declarationFile.addModule({
    name: '"vuex"',
    hasDeclareKeyword: true,
    declarationKind: ModuleDeclarationKind.Module
})

const helpersFile = project.addSourceFileAtPathIfExists("./types/helpers.ts")
forEachStructureChild(helpersFile.getStructure(), child => {
    if (Structure.isTypeAlias(child)) {
        declarationFile.addTypeAlias({ ...child, isExported: false })
    }
})


for (let file of filesToInclude) {
    const includedFile = project.addSourceFileAtPathIfExists(file);
    const structure = includedFile.getStructure();

    forEachStructureChild(structure, child => {
        if (Structure.isImportDeclaration(child) && !child.moduleSpecifier.startsWith('.')) {
            vuexModuleDeclaration.addImportDeclaration(child)
        }

        if (Structure.isClass(child)) {
            vuexModuleDeclaration.addClass({ ...child, hasDeclareKeyword: false })
        }

        if (Structure.isTypeAlias(child)) {
            vuexModuleDeclaration.addTypeAlias(child)
        }

        if (Structure.isInterface(child)) {
            vuexModuleDeclaration.addInterface(child)
        }

        if (Structure.isFunction(child)) {
            vuexModuleDeclaration.addFunction({ ...child, hasDeclareKeyword: false })
        }

        if (Structure.isEnum(child)) {
            vuexModuleDeclaration.addEnum(child)
        }
    })
}

declarationFile.save();