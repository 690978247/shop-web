// 定义获取 HTML 文件的 URL
const htmlUrl = '/';

// 定期检查 HTML 文件的变化
const checkInterval = 15000; // 15秒


async function checkForScriptUpdate() {
    try {
        const response = await fetch(htmlUrl);
        if (!response.ok) {
            return;
        }

        const htmlText = await response.text();
        // 创建一个DOMParser实例
        const parser = new DOMParser();
        // 解析HTML字符串成Document对象
        const doc = parser.parseFromString(htmlText, 'text/html');
        // 查找特定的script标签
        const scriptTag = doc.querySelector('script[type="module"][crossorigin]');
        // 提取src属性值
        const srcValue = scriptTag ? scriptTag.getAttribute('src') : null;

        console.log('Checking for script update...', srcValue)
        if (!srcValue) {
            return;
        }

        const cachedJS = localStorage.getItem('html.js');
        if (!cachedJS) {
            localStorage.setItem('html.js', srcValue)
            return;
        }

        if (srcValue !== cachedJS) {
            document.getElementById('updateDialog').showModal()
            // 弹出升级提示
            const confirmation = confirm('检测网站有新的更新，请升级！');
            if (confirmation) {
                // 更新缓存的脚本文件名
                localStorage.setItem('html.js', srcValue)
                window.location.reload();
            } else {
                // 取消升级提示
            }
        }
    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}

window.clearInterval(checkInterval)

// 初始检查一次
checkForScriptUpdate();

// 设置定期检查
setInterval(checkForScriptUpdate, checkInterval);
