import time
import re
import webbrowser
from stravalib import Client
from datetime import datetime

# 彩色输出类
class Colors:
    RESET = '\033[0m'
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    
    @staticmethod
    def success(message):
        return f"{Colors.GREEN}{Colors.BOLD}{message}{Colors.RESET}"
    
    @staticmethod
    def error(message):
        return f"{Colors.RED}{Colors.BOLD}{message}{Colors.RESET}"
    
    @staticmethod
    def info(message):
        return f"{Colors.BLUE}{Colors.BOLD}{message}{Colors.RESET}"
    
    @staticmethod
    def warning(message):
        return f"{Colors.YELLOW}{Colors.BOLD}{message}{Colors.RESET}"
    
    @staticmethod
    def highlight(message):
        return f"{Colors.CYAN}{Colors.BOLD}{message}{Colors.RESET}"

# --------------------------
# ⚙️  核心配置（交互式输入）
# --------------------------
def get_user_config():
    """获取用户配置信息"""
    print(f"\n{Colors.info('🔧 请输入 Strava API 配置信息')}")
    print(f"{Colors.highlight('📍 配置信息获取位置: https://www.strava.com/settings/api')}")
    print(f"{Colors.info('   - CLIENT_ID 对应页面中的: 客户 ID')}")
    print(f"{Colors.info('   - CLIENT_SECRET 对应页面中的: 客户端密钥')}")
    
    # 从 Strava 开发者中心获取（https://www.strava.com/settings/api）
    client_id = input(f"\n🔑 输入 CLIENT_ID [客户 ID]: ").strip()
    client_secret = input(f"🔑 输入 CLIENT_SECRET [客户端密钥]: ").strip()
    
    return client_id, client_secret


def print_header():
    """打印程序头部信息"""
    header = """
    🚴‍♂️  Strava 认证助手  🚴‍♀️
    """
    print(Colors.highlight(header))
    print("="*60)
    print("此工具将帮助您获取 Strava API 授权令牌")
    print("="*60)


def animate_progress(message="处理中"):
    """显示简单的加载动画"""
    animation = "|/-\\"
    for i in range(8):
        time.sleep(0.15)
        print(f"\r{Colors.info(message)} {animation[i % len(animation)]}", end="", flush=True)
    print("\r", end="", flush=True)


def get_refresh_token_from_url(url, client_id, client_secret):
    """从回调URL中提取授权码并兑换令牌"""
    try:
        # 从URL中提取授权码（code参数）
        code_match = re.search(r"code=([^&]+)", url)
        if not code_match:
            raise Exception("回调URL中未找到有效的code参数")
        
        code = code_match.group(1)
        print(f"{Colors.info('已提取授权码')}: {Colors.highlight(code[:10] + '...')}")
        
        # 显示处理动画
        animate_progress("正在兑换令牌")
        
        # 用授权码兑换令牌
        client = Client()
        token_data = client.exchange_code_for_token(
            client_id=client_id,
            client_secret=client_secret,
            code=code
        )
        
        return token_data
    except Exception as e:
        raise Exception(f"兑换令牌失败: {str(e)}")


def validate_config(client_id, client_secret):
    """验证配置信息是否有效"""
    if not client_id or client_id.strip() == "":
        return False, "CLIENT_ID 不能为空"
    
    if not client_secret or client_secret.strip() == "":
        return False, "CLIENT_SECRET 不能为空"
    
    return True, "配置有效"


def authenticate():
    """执行完整认证流程"""
    print_header()
    
    # 获取用户配置
    client_id, client_secret = get_user_config()
    
    # 验证配置
    is_valid, msg = validate_config(client_id, client_secret)
    if not is_valid:
        print(Colors.error(f"❌ 配置错误: {msg}"))
        print(Colors.info("提示: 这些信息可以从 https://www.strava.com/settings/api 获取"))
        return
    
    print(Colors.success("✅ 配置验证通过！"))
    print()
    
    try:
        # 生成Strava授权链接（使用固定格式）
        authorize_url = f"http://www.strava.com/oauth/authorize?client_id={client_id}&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write"
        
        # 步骤1: 引导用户完成授权
        print(Colors.info("📋 步骤 1: 授权 Strava 访问"))
        print(Colors.highlight("-"*50))
        print("我们将为您自动打开浏览器进行授权。")
        print("请在浏览器中:")
        print("  1. 登录您的 Strava 账号")
        print("  2. 点击 'Authorize' 按钮同意授权")
        print("  3. 授权成功后，复制浏览器地址栏中的完整URL")
        print(Colors.highlight("-"*50))
        
        # 自动打开浏览器
        print(Colors.info("🌐 正在打开浏览器..."))
        success = webbrowser.open(authorize_url)
        
        if not success:
            print(Colors.warning("⚠️  无法自动打开浏览器"))
            print(Colors.highlight("请手动复制以下链接到浏览器:"))
            print(authorize_url)
        
        print()
        
        # 步骤2: 获取回调URL
        print(Colors.info("📋 步骤 2: 输入回调URL"))
        print("授权成功后，浏览器会跳转到一个以 'http://localhost/exchange_token' 开头的URL")
        print(Colors.warning("💡 提示: 若浏览器提示 'localhost 拒绝了连接请求'，请忽略该页面，直接复制地址栏中的完整 URL 并粘贴到终端即可"))
        callback_url = input("\n请粘贴完整的回调URL: ").strip()
        
        if not callback_url:
            raise Exception("URL不能为空")
        
        # 步骤3: 兑换令牌
        print("\n" + Colors.info("📋 步骤 3: 处理授权..."))
        token_data = get_refresh_token_from_url(callback_url, client_id, client_secret)
        
        # 显示结果
        print("\n" + Colors.success("🎉 认证成功！"))
        print(Colors.highlight("="*50))
        print(Colors.success("请保存以下信息（非常重要）:"))
        print("\n" + Colors.BOLD + f"STRAVA_REFRESH_TOKEN = {token_data['refresh_token']}")
        print("\n可选保存（自动过期）:")
        print(f"STRAVA_ACCESS_TOKEN = {token_data['access_token']}")
        # 将Unix时间戳转换为人类可读的格式
        expire_time = datetime.fromtimestamp(token_data['expires_at'])
        print(f"过期时间: {expire_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(Colors.highlight("="*50))
        print("\n" + Colors.info("💡 提示: refresh_token 长期有效，当访问令牌过期时会自动刷新"))
        print(Colors.info("如需重新授权，请再次运行此脚本"))
        
    except KeyboardInterrupt:
        print("\n" + Colors.warning("⚠️  操作已取消"))
    except Exception as e:
        print("\n" + Colors.error(f"❌ 认证失败: {str(e)}"))
        print(Colors.warning("\n可能的原因:"))
        print("  • 回调URL格式错误")
        print("  • 授权码已过期")
        print("  • CLIENT_ID 或 CLIENT_SECRET 填写错误")
        print("\n请重新运行脚本并尝试。")
    finally:
        print("\n" + Colors.info("👋 感谢使用 Strava 认证助手"))


if __name__ == "__main__":
    try:
        authenticate()
    except Exception as e:
        print(Colors.error(f"❌ 程序异常: {str(e)}"))
    finally:
        # 确保程序结束前显示提示
        input("\n按回车键退出...")