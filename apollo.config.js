module.exports = {
  client: {
    name: 'protector',
    service: {
      name: 'github',

      url: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      },

      includes: ['src/**/*.ts'],
      localSchemaFile: './schema.json',
      globalTypesFile: './src/global.ts'
    }
  }
}
