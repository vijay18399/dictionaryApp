const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Word = require('./Word'); 

const Example = sequelize.define('Example', { 
  example: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Examples' 
});

Word.hasMany(Example, { foreignKey: 'wordId', onDelete: 'CASCADE' });
Example.belongsTo(Word, { foreignKey: 'wordId' });

module.exports = Example;
