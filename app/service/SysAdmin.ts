import { Service } from 'egg';
import jwt = require('jsonwebtoken');
import md5 = require('md5');
import { CONSTANT } from '../utils/constant';

export default class SysAdmin extends Service {
  public async login(params: { phone: string; password: string; }) {
    const ctx = this.ctx;
    // 校验账号没有传抛出错误异常
    if (!params.phone) {
      ctx.throw(CONSTANT.FAILCODE, CONSTANT.ACCOUNTNUMBERCANNOTBEEMPTY)
    }
    // 校验密码没有传抛出错误异常
    if (!params.password) {
      ctx.throw(CONSTANT.FAILCODE, CONSTANT.PASSWORDCANNOTBEEMPTY)
    }
    const nonExistent = await ctx.model.SysAdmin.findAll({ where: { phone: params.phone } });
    const data = await ctx.model.SysAdmin.findAll({ where: { phone: params.phone, password: md5(params.password) } });
    // 校验账号是否存在
    if (nonExistent.length <= 0) {
      ctx.throw(CONSTANT.FAILCODE, CONSTANT.ACCOUNTDOESNOTEXIST)
      // 校验密码是否正确
    } else if (data.length <= 0) {
      ctx.throw(CONSTANT.FAILCODE, CONSTANT.PASSWORDERROR)
    } else {
      const token = jwt.sign(JSON.stringify(data), ctx.app.config.jwt.secret)
      return {
        message: CONSTANT.LOGINMSG,
        status: CONSTANT.OKCODE,
        data: {
          token,
          data
        }
      }
    }
  }

  public async queryAll(params: any) {
    const ctx = this.ctx;
    const status = params.status ? params.status : 1;
    const name = params.name ? params.name : '';
    const query = {
      where: {
        status: status,
        name: name
      },
      limit: params.pageSize, offset: params.pageNum * params.pageSize,
      order: [['createTime', 'DESC']]
    };
    return await ctx.model.SysAdmin.findAll(query);
  }

  public async save(params: any) {
    const ctx = this.ctx;
    return await ctx.model.SysAdmin.create(params);
  }

  public async update(params: any, options: any) {
    const ctx = this.ctx;
    return await ctx.model.SysAdmin.update(params, options);
  }
}
