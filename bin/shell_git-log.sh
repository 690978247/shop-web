#!/bin/bash

# 进入项目目录
pwd

project="https://codeup.aliyun.com/6359ecaed02abff84af1e213/hz/ud-shop-web/commit/"

## 生成提交历史到桌面的文件（以文本文件形式）
#git log --pretty=format:"🔵 %s [%an]🕐%ad🔰$project%H" --date=format:"%Y-%m-%d %H:%M:%S" > ~/Desktop/git_commit_history.md
#
#
#改为生成markdown格式,点击commit 消息,可以跳转链接
#
## 生成提交历史到桌面的文件（以文本文件形式）
#git log --pretty=format:"🔵 %s [%an]🕐%ad🔰$project%H" --date=format:"%Y-%m-%d %H:%M:%S" > ~/Desktop/git_commit_history.md

# 设置查询日期范围
start_date="2024-03-01"
end_date="2024-04-03"

# 设置筛选作者
author="diaowanjun"

git log --since="$start_date" --until="$end_date" --pretty=format:"- 🔵 [%s]($project/%H) [%an] 🕐%ad" --date=format:"%Y-%m-%d %H:%M:%S" > git_commit_history.md

#grep -v "Merge remote-tracking " ~/Desktop/ud-cr-001.md | grep -v ":" | sed 's/^/- ❌ /' > filtered_git_commit_history.md


echo "完成"