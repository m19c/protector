module.exports = {
  client: {
    name: 'action-bratection',
    service: {
      name: 'github',

      url: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      },

      includes: ['src/**/*.ts'],
      localSchemaFile: './schema.json',
      globalTypesFile: './src/global.ts'
    }
  }
}
