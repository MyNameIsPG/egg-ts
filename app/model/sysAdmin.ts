'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const SysAdmin = app.model.define('tb_sys_admin', {
    uuid: {
      type: STRING,
      primaryKey: true,
    },
    name: STRING,
    phone: STRING,
    password: STRING,
    roleId: {
      type: STRING,
      field: 'role_id'
    },
    headPic: {
      type: STRING,
      field: 'head_pic'
    },
    status: INTEGER,
    createTime: {
      type: DATE,
      field: "create_time"
    },
    modifyTime: {
      type: DATE,
      field: "modify_time"
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  return SysAdmin;
};