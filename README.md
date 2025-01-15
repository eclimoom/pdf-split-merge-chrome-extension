# PdfSplitMergeChromeExtension

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## 本地服务

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

`ng build --watch` 

## 代码脚手架

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## 构建

Run `ng build ` to build the project. The build artifacts will be stored in the `dist/` directory.

Use the `--prod` flag for a production build.
`ng build --prod --base-href ./pdf/`

## 运行单元测试

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### 隐私条款
http://devfront.top/file-page/privacy.html

### 功能设计
1. 实现pdf拆分， 将多页pdf拆分为单页的多个pdf
  - 拆分名字 原名称1.pdf, 原名称2.pdf, ...
  - 拆分规则：
    每一页拆分为一个新pdf， 每两页拆分为一个新pdf, 后期自定义规则
2. 实现多张图片， 合并为一个pdf
   - 合并名字 原名称合并.pdf
3. 实现pdf合并， 将多个pdf合并为一个pdf
   - 合并名字 原名称合并.pdf


用途
1. pdf拆分， 用于将多页pdf拆分为单页pdf， 用于打印

## 项目基本结构
  
```
├── src/
│   ├── app/
│   │   ├── core/                     # 核心模块
│   │   │   ├── services/             # 核心服务
│   │   │   │   ├── pdf.service.ts    # PDF 处理服务（拆分、合并逻辑）
│   │   │   │   ├── file.service.ts   # 文件操作服务（上传、下载等）
│   │   │   │   └── storage.service.ts# 本地存储服务（保存用户操作历史）
│   │   │   └── models/               # 数据模型
│   │   │       ├── pdf.model.ts      # PDF 文件的类型定义
│   │   │       └── image.model.ts    # 图片文件的类型定义
│   │   ├── shared/                   # 共享模块
│   │   │   ├── components/           # 可复用组件
│   │   │   │   ├── file-upload/      # 文件上传组件
│   │   │   │   │   ├── file-upload.component.ts
│   │   │   │   │   ├── file-upload.component.html
│   │   │   │   │   └── file-upload.component.scss
│   │   │   │   └── progress-bar/     # 进度条组件
│   │   │   │       ├── progress-bar.component.ts
│   │   │   │       ├── progress-bar.component.html
│   │   │   │       └── progress-bar.component.scss
│   │   │   └── directives/           # 共享指令（例如拖拽上传）
│   │   │       └── drag-drop.directive.ts
│   │   ├── features/                 # 功能模块
│   │   │   ├── pdf-split/            # PDF 拆分功能模块
│   │   │   │   ├── pdf-split.component.ts
│   │   │   │   ├── pdf-split.component.html
│   │   │   │   └── pdf-split.component.scss
│   │   │   ├── pdf-merge/            # 图片合并功能模块
│   │   │   │   ├── pdf-merge.component.ts
│   │   │   │   ├── pdf-merge.component.html
│   │   │   │   └── pdf-merge.component.scss
│   │   │   ├── history/              # 用户历史记录模块
│   │   │   │   ├── history.component.ts
│   │   │   │   ├── history.component.html
│   │   │   │   └── history.component.scss
│   │   │   └── home/                 # 首页模块
│   │   │       ├── home.component.ts
│   │   │       ├── home.component.html
│   │   │       └── home.component.scss
│   │   ├── app.component.ts          # 主应用组件
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts             # 主应用模块
│   ├── assets/                       # 静态资源文件
│   │   └── styles/                   # 全局样式
│   │       ├── _variables.scss       # SCSS 变量定义
│   │       ├── _mixins.scss          # SCSS 混入
│   │       └── main.scss             # 全局样式
│   ├── environments/                 # 环境配置
│   │   ├── environment.ts            # 开发环境
│   │   └── environment.prod.ts       # 生产环境
│   ├── manifest.json                 # Chrome 扩展配置文件
│   ├── background.js                 # Chrome 扩展后台脚本
│   ├── content.js                    # Chrome 扩展内容脚本
│   └── popup.html                    # 插件弹出窗口（主入口）
├── angular.json                      # Angular 配置文件
├── package.json                      # 项目依赖描述
└── README.md                         # 项目说明
```
