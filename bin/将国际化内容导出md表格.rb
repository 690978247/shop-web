# 读取文件内容


Dir.chdir("..")
target_folder = "#{Dir.pwd}/src/language/modules/"
Dir.chdir(target_folder)



zh_file_path = "#{target_folder}/zh.ts"  # 请将文件路径替换为实际文件路径

def get_kv(path)
  file_content = File.read(path)
  
  map = {}
  # 遍历每一行
  file_content.each_line do |line|
    # 检查是否包含":"
    if line.include?(":")
      # 提取key和value
      key, value = line.split(":", 2).map(&:strip)
      
      # 如果value以单引号或双引号开头，则提取开头部分
      if value.match(/^['"]/)
        value = value.match(/^['"](.*?)['"]/)[1]
      end
      
      unless value.to_s.include?("{")
        map[key] = value
      end
    end
  end
  map
end

def main(target_folder)
  zh_file_path = "#{target_folder}/zh.ts"  # 请将文件路径替换为实际文件路径
  zhresult = get_kv(zh_file_path)
  
  en_file_path = "#{target_folder}/en.ts"  # 请将文件路径替换为实际文件路径
  enresult = get_kv(en_file_path)
  
  
  es_file_path = "#{target_folder}/es.ts"  # 请将文件路径替换为实际文件路径
  esresult = get_kv(es_file_path)
  
  br_file_path = "#{target_folder}/br.ts"  # 请将文件路径替换为实际文件路径
  brresult = get_kv(br_file_path)

  
  markdown_table = "| Key(开发人员编写) | 中文 | 英文 | 西班牙(es) | 葡萄牙(br) |\n|-----|-------|-------|-------|-------|\n"
  
  zhresult.each do |key, value|
    en_value = enresult[key] 
    es_value = esresult[key]
    br_value = brresult[key]
    
    unless markdown_table.include?key
        markdown_table << "| #{key} | #{value} |#{en_value} |#{es_value} |#{br_value} |\n"
    end
  end
  
  puts markdown_table
  
end

main target_folder
