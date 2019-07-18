# angular脚手架
for angular >= 6

# 需要修改配置的地方如下：

package.json
- name
- description
- keywords（可选）
- author（可选）


config/webpack.common.js
- plugins CopyWebpackPlugin favicon


config/webpack.prod.js
- plugins CopyWebpackPlugin（可选，设置生产环境的app.config）


src/index.html
- title
- base href（可选）
- link favicon


src/favicon


# 动态模块示例
```javascript
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        XxxComponent,
        XxxDirective,
        XxxPipe
        ...
    ]
})
export class DynamicModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DynamicModule,
            providers: [
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: [
                        XxxComponent,
                        XxxDirective,
                        XxxPipe
                        ...
                    ],
                    multi: true,
                }
            ]
        };
    }
}
```

# 在需要使用动态模块的模块(核心/特性)导入
```javascript
DynamicModule.forRoot()
```