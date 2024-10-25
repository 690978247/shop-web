#!/usr/bin/env ruby
current_directory = Dir.pwd
puts "当前目录: #{current_directory}"

# 切换到上一个目录
Dir.chdir('..')

# 获取切换后的目录
new_directory = Dir.pwd
puts "切换到上一个目录后: #{new_directory}"

# 定义一个方法来执行命令并打印输出
def execute_command(command)
  puts "Executing: #{command}"
  result = `#{command}`
  if $?.success?
    puts "Success: #{result}"
  else
    puts "Error: #{result}"
    exit 1
  end
end

# 读取当前分支名称
current_branch = `git branch --show-current`.strip

# 确保当前分支是 release/1.6.3 格式的分支
unless current_branch.match?(/^release\/\d+\.\d+\.\d+$/)
  puts "当前分支不是 release/x.x.x 格式: #{current_branch}"
  exit 1
end

# 获取版本号 1.6.3
version = current_branch.split('/').last

# 切换到 master 分支
execute_command('git checkout master')

# 从远程获取最新的 master 分支
execute_command('git pull origin master')

# 合并当前的 release 分支到 master
execute_command("git merge --no-ff #{current_branch}")

# 创建一个新的 tag
execute_command("git tag #{version}")

# 推送合并后的 master 分支到远端
execute_command('git push origin master')

# 推送 tag 到远端
execute_command("git push origin #{version}")

puts "合并完成并推送成功！"