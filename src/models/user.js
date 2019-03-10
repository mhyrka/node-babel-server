import bcrypt from 'bcrypt'

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      // Validation
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  })

  // Encrypt and salt passwords before storing in DB using bcrypt
  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash()
  })
  /**Each salt round makes it more costly to hash the
   * password, which makes it more costly for attackers
   * to decrypt the hash value. A common value for salt
   * rounds nowadays ranged from 10 to 12, as increasing
   * the number of salt rounds might cause performance
   * issues both ways. */
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10
    return await bcrypt.hash(this.password, saltRounds)
  }

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
  }

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' })
  }
  /* 
  Custom method that returns the current user from the DB
  When giving your model these access methods, you may end 
  up with a concept called fat models. An alternative would 
  be writing separate services like functions or classes 
  for these data access layer functionalities.
  */
  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login },
    })

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      })
    }

    return user
  }

  return User
}

export default user
