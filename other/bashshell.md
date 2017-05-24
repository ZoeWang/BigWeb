# bash shell

## 什么是bash？
bash是Bourne Again Shell的简称，是从unix系统中的sh发展而来，是用户和linux内核交互的工具，用户通过bash操作内核完成系统的使用和管理。

## shell 的种类
* /bin/sh （已经被/bin/bash替代）
* /bin/bash （默认的shell）
* /bin/ksh （源自贝尔实验室，兼容bash）
* /bin/tcsh（整合了 C shell，功能更为强大）
* /bin/csh （已经被tcsh取代）
* /bin/zsh （源自ksh功能更为强大）
* 每种shell的功能比较类似，但是语法稍有不同

## bash shell的变量概述

### 变量是代表一些值得符号：
* 可以通过变量来设置shell或者其他程序。
* 变量存在于内存中。
* Linux有自定义变量local和环境变量environment
* 自定义变量和环境变量作用范围不同

### 可以通过以下指令来查看变量
* set可以查看所有变量
* env可以查看所有的环境变量

## bash shell有以下几种设置方式：

* 通过自定义变量来设置
    * VARIABLE = value 定义变量
    * echo $VARIABLE 获取变量值
    * 不能已特殊字符开头定义变量名
    * 使用双引号才能把变量名传入到变量值
    * unset VARIABLE 删除变量
    * HISTFILESIZE:记录历史指令保存
    * COLUMNS:终端窗口显示的宽度
    * LINES：终端窗口显示的高度
    * PS1：设置提示符号前面的内容样式
* 通过别名（Aliases）来设置
    * $alias lss='ls-la'
    * 可以用alias自身查看所有的别名
    * 使用alias和alias查看值
    * type -a alias名称
    * unalias删除定义
* 通过set指令设置
    * set自身查看所有变量值
    * 设置shell内部的属性值（set -o noclobber,set -o vi)
* 通过环境变量设置
    * 自定义变量只能在当前的shell环境中生效
    * 环境变量会在整个主机下的shell环境中生效
    * 使用$ export[variable name]来设置
* PATH环境变量
    * 系统预设的环境变量
    * 执行一些没有指定路径的指令时回去该路径中找
    * PATH=$PATH.:将隐藏路径设置到PATH中，会带来安全问题。

## shell startup scripts

### 用户登录或其他非登录动作时会自动执行的一些shell脚本：
* 建立自定义环境变量或者执行set指令设置shell
* 建立环境变量，设置其他程序
* 使用alias，简化后续的操作
* 登录的时候执行哪些程序
* 分为login和non-login脚本

### login shell:
* 通过完整的登录流程时运行的shell。
* 首先会读取/etc/profile(PATH/USER/HOSTNAME/HISTSIZE等）。
* 读取/etc/profile.d/*.sh(颜色、语言、指令别名等）。
* ~/.bash_profile、~/.bash_login、~/.profile（只依次读取其中一个）。
* source加载指令变更

### non-login shell：
* 不需要登录即可运行shell,如su和原bash下的新bash动作。
* ~/.bash_rc、/etc/bashrc。
   * 读取/etc/profile.d/*.sh（颜色、语言、指令别名等）
* ~/.bash_logout：
   * 在注销用户时会运行的脚本
   * 可以执行备份、缓存和临时文件清理等任务

## 标准输入和输出错误概述
* 标准输入是指令数据的输入，代码为0，使用<或者<<,默认是键盘
* 标准输出是指令执行成功返回的结果，代码为1，使用>或者>>,默认由屏幕显示
* 标准错误输出是指令执行失败返回的错误信息，代码为2，使用2>或者2>>,默认是屏幕。

## 数据流重定向的使用
* <:指定输入的数据媒体来源
* 1>:将正确的内容覆盖输出到指定的媒介
* 1>>：将正确的内容追加到指定的媒介
* 2>：将错误信息覆盖输出到指定的媒介
* 2>>将错误信息追加输出到指定的媒介

### 多个指令执行的判断方法
* bash1&&bash2 （前者执行成功才会执行后者）
* bash1||bash2（前者执行完毕且失败才会执行后者）

## 管道命名的使用
* 命令通过通道符|连接
* 能够接受标准输入（stdin),如tail/more/grep等
* 能够接收来自于前一个指令的数据成为stdin进行处理
* grep 指令，grep [-cinv] 'key' filename,支持正则
   * -c，计算字符出现的个数，
   * -i，忽略大小写进行查找；
   * -n，输出行号；
   * -v，显示没有该字符的行；
* sort 指令，sort[-fbknrtu]filename
   * -f，忽略大小写；
   * -b，忽略空格；
   * -M，以月份英文名排序；
   * -n，使用数字排序；
   * -r，逆向排序；
   * -t，分隔符，默认是tab分割；
   * -k，以第几列来排序。
* wc指令，wc[-lwm]filename,统计功能。
   * -l，统计行；
   * -w，统计词；
   * -m，统计字符；
