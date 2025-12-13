function readPackage(pkg, context) {
  // Adiciona nx como peer do @nx/js para resolver require.resolve('nx')
  if (pkg.name === '@nx/js') {
    pkg.peerDependencies = pkg.peerDependencies || {};
    pkg.peerDependencies.nx = '*';
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
