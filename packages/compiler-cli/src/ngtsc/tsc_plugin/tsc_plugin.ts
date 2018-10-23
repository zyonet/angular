import * as ts from 'typescript';
import {TscPlugin, createProxy} from '@bazel/typescript';

export const NgTscPlugin: TscPlugin = {
  wrap(program: ts.Program, config: {}) {
    const proxy = createProxy(program);
    proxy.getSemanticDiagnostics = (sourceFile: ts.SourceFile) => {
      const result: ts.Diagnostic[] = [...program.getSemanticDiagnostics(sourceFile)];

      // For demo purposes, trigger a diagnostic when the sourcefile has a magic string
      if (sourceFile.text.indexOf("diag") >= 0) {
        const fake: ts.Diagnostic = {
          file: sourceFile,
          start: 0,
          length: 3,
          messageText: 'Example Angular Compiler Diagnostic',
          category: ts.DiagnosticCategory.Error,
          code: 12345,
          // source is the name of the plugin.
          source: 'Angular',
        };
        result.push(fake);
      }
      return result;
    };
    return proxy;
  },

  createTransformers(tc: ts.TypeChecker) {
    const afterDeclarations: Array<ts.TransformerFactory<ts.SourceFile>> =
        [(context: ts.TransformationContext) => (sf: ts.SourceFile) => {
          const visitor = (node: ts.Node): ts.Node => {
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
              const clz = node as ts.ClassDeclaration;
              return ts.updateClassDeclaration(clz, clz.decorators,
                node.modifiers, ts.createIdentifier('NEWNAME'),
                clz.typeParameters, clz.heritageClauses,
                clz.members);
            }
            return ts.visitEachChild(node, visitor, context);
          };
          return visitor(sf) as ts.SourceFile;
        }];
    return {
      afterDeclarations
    };
  }
};

// tsc_wrapped expects the plugin to be the default export of this module
export default NgTscPlugin;
