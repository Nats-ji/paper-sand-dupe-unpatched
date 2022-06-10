# PaperMC刷沙恢复 —— 可刷沙子混凝土的Paper服务端

[English](https://github.com/Nats-ji/paper-sand-dupe-unpatched/blob/master/README.md)

## 这是什么？

这是一个重新编译的我的世界PaperMC服务端。这个编译版本移除了PaperMC中修复[复制重力方块BUG](https://minecraft.fandom.com/wiki/Tutorials/Block_and_item_duplication#Gravity_Block_Duplication_.28Patched_in_Paper_1.15.2_Build_.23358.29)的补丁。从而可以像在原版服务端中一样尽情复制沙子和其他重力方块。

这是一个在Github Action上每隔一段时间自动运行的Node.js应用。

它会拉取最新版本的[PaperMC](https://github.com/PaperMC/Paper),
然后撤销PaperMC中修复复制重力方块BUG的补丁。

它会每天运行2次以检测是否有新版本的PaperMC。在移除相关补丁之后，它会自动重新编译jar然后[发布](https://github.com/Nats-ji/paper-sand-dupe-unpatched/releases)在本仓库。

## 开源许可
这个Node.js应用以及其发布的jar文件全部采用GLPv3许可。
