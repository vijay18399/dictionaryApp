const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Word = require('./Word'); 

const CEFR = sequelize.define('CEFR', { 
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Voice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Phonetics: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false,
  tableName: 'CEFR' 
});

CEFR.belongsTo(Word, { foreignKey: 'wordId' });
Word.hasOne(CEFR, { foreignKey: 'wordId', onDelete: 'CASCADE' });

module.exports = CEFR;
