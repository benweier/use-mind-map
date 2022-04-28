module.exports = (api) => {
  const BABEL_ENV = api.env()

  const plugins = []

  if (BABEL_ENV === 'development') {
    plugins.push('react-refresh/babel')
  }

  return {
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
          corejs: '3',
          targets: {
            esmodules: true,
          },
        },
      ],
      [
        '@babel/react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/typescript',
    ],
    plugins,
  }
}
