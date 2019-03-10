import Sequelize from 'sequelize'

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    // set operatorAliases to false here to avoid deprecation warning.
    // see more at http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
    operatorsAliases: false,
  },
)

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export { sequelize }

export default models
