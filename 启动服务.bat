@echo off
echo ==============================
echo  6月运营驾驶舱 - 启动器
echo ==============================
echo 启动服务中...
cd /d "%~dp0"
start python -m http.server 8900
echo ✅ 服务已启动！
echo 请在浏览器打开：http://127.0.0.1:8900/
echo 按 Ctrl+C 关闭服务
timeout /t 5
start http://127.0.0.1:8900/