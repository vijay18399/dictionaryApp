const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Word = sequelize.define('Word', { 
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Word: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false,
  tableName: 'Words' 
});

module.exports = Word;
