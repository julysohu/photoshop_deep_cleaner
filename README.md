## 一键压缩PSD文件从GB变为MB

### 原理
    主要原理其实很简单：删除PSD中大量的`元数据`。
    元数据：对文件操作的历史记录数据，通常一个PDS`容量的90%`多都是元数据占用的。
    网上流传的脚本只能清理当前打开文件的元数据，却无法清理`智能对象`和智能对象中嵌套智能对象的元数据，此脚本可以一键清理所有智能对象及其子孙对象的元数据。
    实测1.9G的psd清理过后为47M。

### 使用说明

* 下载压缩包：https://github.com/julysohu/photoshop_deep_cleaner/archive/master.zip
* 在Photoshop中打开psd文件，菜单栏选择 文件 --> 脚本 --> 浏览；
* 选择压缩包中的 PsDeepCleaner.jsx；
