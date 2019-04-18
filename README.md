# 需要修改配置的地方如下：

package.json
- name
- description
- keywords（可选）
- author（可选）


config/webpack.dev.js
- devServer.host（可选）
- devServer.port（可选）


config/webpack.prod.aot.js
- plugins baseHref（可选，生产环境通常有项目前缀）
- plugins CopyWebpackPlugin（可选，设置生产环境的app.config）


config/prod-server.config.json
- port（可选）


src/index.html
- title


src/favicon


# 不使用AOT编译或没有动态模块
src/app/core/core.module.ts
config/webpack.prod.aot.js
- for dynamic module

