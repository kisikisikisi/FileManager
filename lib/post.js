'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/lexsol',
  {
    logging: false,
    operatorsAliases: false 
  });
const Post = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  task: {
    type: Sequelize.TEXT
  },
  person: {
    type: Sequelize.STRING
  },
  progress: {
    type: Sequelize.STRING
  },
  importance: {
    type: Sequelize.STRING
  },
  taskDate: {
    type: Sequelize.STRING
  },
  compDate: {
    type: Sequelize.STRING
  },
  manHour: {
    type: Sequelize.INTEGER
  },
  taskType: {
    type: Sequelize.STRING
  },
  note: {
    type: Sequelize.TEXT
  }
}, {
  freezeTableName: true,
  timestamps: true
});

Post.sync();
module.exports = Post;