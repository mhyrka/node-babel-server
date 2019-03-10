const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING,
      // Validation
      validate: {
        // Custom validation / error message
        notEmpty: {
          args: true,
          msg: 'Message must have text',
        },
      },
    },
  })

  Message.associate = models => {
    Message.belongsTo(models.User)
  }

  return Message
}

export default message
