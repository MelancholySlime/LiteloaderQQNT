/**
 * LiteLoaderQQNT-i18n v8.0 (Bản Quét Toàn Diện 100% — Deep Bundle Scanner + Cross-Window Sync + Substring Engine)
 * Giải quyết triệt để 3 vấn đề khiến các bản trước bị sót chữ:
 * 1. Đồng bộ danh sách từ chưa dịch xuyên suốt mọi cửa sổ QQ (Cửa sổ Cài đặt không còn ghi đè làm mất từ đã quét ở Cửa sổ Chính).
 * 2. Quét xuyên qua Shadow DOM, thuộc tính ẩn và tự động tách ghép cụm từ con (Substring Replacement).
 * 3. Tích hợp nút "🔍 Quét sâu 100% mã nguồn giao diện QQ (Deep Scan)" & "⚡ Dịch tự động toàn bộ 1 lần" ngay trong Cài đặt.
 */

var STORAGE_KEY_LANG = "liteloader_qqnt_i18n_lang";
var STORAGE_KEY_SUBSTRING = "liteloader_qqnt_i18n_substring_v8";
var STORAGE_KEY_UNTRANSLATED = "liteloader_qqnt_i18n_untranslated_master_v8";
var STORAGE_KEY_CUSTOM_DICT = "liteloader_qqnt_i18n_custom_dict_v8";

var currentLang = localStorage.getItem(STORAGE_KEY_LANG) || "vi"; // "vi" | "en" | "zh"
var enableSubstringMatch = localStorage.getItem(STORAGE_KEY_SUBSTRING) !== "false"; // Mặc định BẬT dịch cụm từ con

// Từ điển mở rộng được lưu vĩnh viễn khi bấm "Dịch tự động toàn bộ 1 lần"
var customDict = { vi: {}, en: {} };
try {
  var savedCustom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_DICT) || "{}");
  if (savedCustom.vi) customDict.vi = savedCustom.vi;
  if (savedCustom.en) customDict.en = savedCustom.en;
} catch (e) {}

function saveCustomDict() {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_DICT, JSON.stringify(customDict));
  } catch (e) {}
}

var I18N_DICT = {
  // =========================================================================
  // 1. CỬA SỔ CHÍNH, THANH TIÊU ĐỀ & TRẠNG THÁI (MAIN WINDOW & TOP BAR)
  // =========================================================================
  "腾讯QQ": { vi: "Tencent QQ", en: "Tencent QQ" },
  "腾讯QQtest": { vi: "Tencent QQ (Test)", en: "Tencent QQ (Test)" },
  "撤回了一条消息": { vi: " vừa thu hồi một tin nhắn", en: " recalled a message" },
  "新消息": { vi: "Tin nhắn mới", en: "New Messages" },
  "帮助中心": { vi: "Trung tâm Trợ giúp", en: "Help Center" },
  "意见反馈": { vi: "Góp ý & Báo lỗi", en: "Send Feedback" },
  "QQ官网": { vi: "Trang chủ QQ (im.qq.com)", en: "QQ Official Website" },
  "文件已损坏，请重新安装QQ。": { vi: "Tệp đã bị hỏng, vui lòng cài đặt lại QQ.", en: "Files corrupted, please reinstall QQ." },
  "退出": { vi: "Thoát", en: "Exit" },
  "【图片】": { vi: "[Hình ảnh]", en: "[Photo]" },
  "【表情】": { vi: "[Nhãn dán]", en: "[Sticker]" },
  "【动画表情】": { vi: "[Nhãn dán động]", en: "[Animated Sticker]" },
  "【视频】": { vi: "[Video]", en: "[Video]" },
  "【语音】": { vi: "[Tin nhắn thoại]", en: "[Voice]" },
  "【文件】": { vi: "[Tệp tin]", en: "[File]" },
  "[问号]": { vi: "[Chấm hỏi]", en: "[Question]" },
  "[微笑]": { vi: "[Mỉm cười]", en: "[Smile]" },
  "[撇嘴]": { vi: "[Bĩu môi]", en: "[Grimace]" },
  "[色]": { vi: "[Thả tim]", en: "[Drool]" },
  "[发呆]": { vi: "[Ngẩn ngơ]", en: "[Scowl]" },
  "[得意]": { vi: "[Đắc ý]", en: "[Cool]" },
  "[流泪]": { vi: "[Rơi lệ]", en: "[Sob]" },
  "[害羞]": { vi: "[Ngại ngùng]", en: "[Shy]" },
  "[闭嘴]": { vi: "[Im lặng]", en: "[Silent]" },
  "[睡]": { vi: "[Ngủ gật]", en: "[Sleep]" },
  "[大哭]": { vi: "[Khóc lớn]", en: "[Cry]" },
  "[尴尬]": { vi: "[Ngượng ngùng]", en: "[Awkward]" },
  "[发怒]": { vi: "[Tức giận]", en: "[Angry]" },
  "[调皮]": { vi: "[Tinh nghịch]", en: "[Naughty]" },
  "[呲牙]": { vi: "[Cười tươi]", en: "[Grin]" },
  "[惊讶]": { vi: "[Ngạc nhiên]", en: "[Surprised]" },
  "[难过]": { vi: "[Buồn bã]", en: "[Sad]" },
  "[酷]": { vi: "[Ngầu]", en: "[Cool]" },
  "[冷汗]": { vi: "[Toát mồ hôi]", en: "[Sweat]" },
  "[抓狂]": { vi: "[Phát điên]", en: "[Crazy]" },
  "[吐]": { vi: "[Nôn]", en: "[Puke]" },
  "[偷笑]": { vi: "[Cười thầm]", en: "[Chuckle]" },
  "[可爱]": { vi: "[Đáng yêu]", en: "[Cute]" },
  "[白眼]": { vi: "[Đảo mắt]", en: "[Roll Eyes]" },
  "[傲慢]": { vi: "[Kiêu ngạo]", en: "[Arrogant]" },
  "[饥饿]": { vi: "[Đói bụng]", en: "[Hungry]" },
  "[困]": { vi: "[Buồn ngủ]", en: "[Sleepy]" },
  "[惊恐]": { vi: "[Hoảng sợ]", en: "[Terrified]" },
  "[流汗]": { vi: "[Đổ mồ hôi]", en: "[Sweating]" },
  "[憨笑]": { vi: "[Cười hiền]", en: "[Silly Laugh]" },
  "[悠闲]": { vi: "[Thảnh thơi]", en: "[Relaxed]" },
  "[奋斗]": { vi: "[Cố lên]", en: "[Strive]" },
  "[疑问]": { vi: "[Thắc mắc]", en: "[Question]" },
  "[嘘]": { vi: "[Suỵt]", en: "[Shh]" },
  "[晕]": { vi: "[Chóng mặt]", en: "[Dizzy]" },
  "[衰]": { vi: "[Xui xẻo]", en: "[Unlucky]" },
  "[骷髅]": { vi: "[Đầu lâu]", en: "[Skull]" },
  "[敲打]": { vi: "[Gõ đầu]", en: "[Hammer]" },
  "[再见]": { vi: "[Tạm biệt]", en: "[Bye]" },
  "[擦汗]": { vi: "[Lau mồ hôi]", en: "[Wipe Sweat]" },
  "[抠鼻]": { vi: "[Ngoáy mũi]", en: "[Nose Pick]" },
  "[鼓掌]": { vi: "[Vỗ tay]", en: "[Clap]" },
  "[坏笑]": { vi: "[Cười gian]", en: "[Smirk]" },
  "[哈欠]": { vi: "[Ngáp]", en: "[Yawn]" },
  "[鄙视]": { vi: "[Khinh bỉ]", en: "[Disdain]" },
  "[委屈]": { vi: "[Tủi thân]", en: "[Wronged]" },
  "[快哭了]": { vi: "[Sắp khóc]", en: "[About to Cry]" },
  "[阴险]": { vi: "[Nhất quỷ nhì ma]", en: "[Sly]" },
  "[亲亲]": { vi: "[Hôn gió]", en: "[Kiss]" },
  "[可怜]": { vi: "[Đáng thương]", en: "[Pitiful]" },
  "[捂脸]": { vi: "[Che mặt cười]", en: "[Facepalm]" },
  "[笑哭]": { vi: "[Cười ra nước mắt]", en: "[Joy]" },
  "[doge]": { vi: "[Doge]", en: "[Doge]" },
  "[惊喜]": { vi: "[Bất ngờ]", en: "[Surprise]" },
  "[点赞]": { vi: "[Thích]", en: "[Like]" },
  "[强]": { vi: "[Tuyệt vời]", en: "[Thumbs Up]" },
  "[握手]": { vi: "[Bắt tay]", en: "[Handshake]" },
  "[抱拳]": { vi: "[Đa tạ]", en: "[Salute]" },
  "[OK]": { vi: "[OK]", en: "[OK]" },
  "[爱心]": { vi: "[Trái tim]", en: "[Heart]" },
  "[玫瑰]": { vi: "[Hoa hồng]", en: "[Rose]" },
  "窗口控制区域": { vi: "Vùng điều khiển cửa sổ", en: "Window Controls" },
  "切换为经典模式": { vi: "Chuyển sang chế độ Cổ điển", en: "Switch to Classic Mode" },
  "切换为效率模式": { vi: "Chuyển sang chế độ Hiện đại", en: "Switch to Efficiency Mode" },
  "最小化": { vi: "Thu nhỏ", en: "Minimize" },
  "最大化": { vi: "Phóng to", en: "Maximize" },
  "向下还原": { vi: "Khôi phục kích thước", en: "Restore Down" },
  "在线状态": { vi: "Trạng thái hoạt động", en: "Online Status" },
  "在线状态 在线": { vi: "Trạng thái: Đang hoạt động", en: "Status: Online" },
  "在线状态 离开": { vi: "Trạng thái: Tạm vắng", en: "Status: Away" },
  "在线状态 忙碌": { vi: "Trạng thái: Đang bận", en: "Status: Busy" },
  "在线状态 请勿打扰": { vi: "Trạng thái: Không làm phiền", en: "Status: Do Not Disturb" },
  "在线状态 隐身": { vi: "Trạng thái: Ẩn danh", en: "Status: Invisible" },
  "在线状态 离线": { vi: "Trạng thái: Ngoại tuyến", en: "Status: Offline" },
  "个性签名:未设置,点击编辑": { vi: "Tiểu sử: Chưa đặt, bấm để chỉnh sửa", en: "Bio: Not set, click to edit" },
  "编辑个性签名": { vi: "Chỉnh sửa dòng tiểu sử", en: "Edit Bio" },
  "工具栏": { vi: "Thanh công cụ", en: "Toolbar" },
  "天气:晴,点击查看详情": { vi: "Thời tiết: Nắng đẹp (Bấm xem chi tiết)", en: "Weather: Sunny (Click for details)" },
  "晴": { vi: "Nắng", en: "Sunny" },
  "多云": { vi: "Nhiều mây", en: "Cloudy" },
  "阴": { vi: "Trời âm u", en: "Overcast" },
  "雾": { vi: "Sương mù", en: "Fog" },
  "霾": { vi: "Sương mù nhẹ", en: "Haze" },
  "小雨": { vi: "Mưa nhỏ", en: "Light Rain" },
  "中雨": { vi: "Mưa vừa", en: "Moderate Rain" },
  "大雨": { vi: "Mưa to", en: "Heavy Rain" },
  "雷阵雨": { vi: "Mưa rào và dông", en: "Thunderstorm" },
  "黑夜": { vi: "Ban đêm", en: "Night" },
  "白天": { vi: "Ban ngày (Sáng)", en: "Light" },
  "夜间": { vi: "Ban đêm (Tối)", en: "Dark" },
  "暂时没有新消息": { vi: "Hiện chưa có tin nhắn mới", en: "No new messages" },
  "星期一": { vi: "Thứ Hai", en: "Monday" },
  "星期二": { vi: "Thứ Ba", en: "Tuesday" },
  "星期三": { vi: "Thứ Tư", en: "Wednesday" },
  "星期四": { vi: "Thứ Năm", en: "Thursday" },
  "星期五": { vi: "Thứ Sáu", en: "Friday" },
  "星期六": { vi: "Thứ Bảy", en: "Saturday" },
  "星期日": { vi: "Chủ Nhật", en: "Sunday" },
  "星期天": { vi: "Chủ Nhật", en: "Sunday" },
  "[动画表情]": { vi: "[Nhãn dán động]", en: "[Animated Sticker]" },
  "加入了群聊。": { vi: "đã tham gia nhóm chat.", en: "joined the group chat." },
  "新功能介绍": { vi: "Giới thiệu tính năng mới", en: "What's New" },
  "QQ游戏": { vi: "Trò chơi QQ (QQ Games)", en: "QQ Games" },
  "QQ游戏中心": { vi: "Trung tâm Game QQ", en: "QQ Game Center" },
  "跳转畅玩": { vi: "Mở chơi ngay", en: "Play Now" },
  "会员专区": { vi: "Đặc quyền VIP", en: "VIP Zone" },
  "消息列表": { vi: "Danh sách tin nhắn", en: "Message List" },
  "会话": { vi: "Cuộc trò chuyện", en: "Chats" },
  "迷你窗": { vi: "Cửa sổ thu gọn (Mini)", en: "Mini Window" },
  "迷你窗 Ctrl + Alt + E": { vi: "Cửa sổ thu gọn (Ctrl + Alt + E)", en: "Mini Window (Ctrl + Alt + E)" },
  "表情分类列表": { vi: "Danh mục nhãn dán", en: "Sticker Categories" },
  "设置类型列表": { vi: "Danh mục cài đặt", en: "Settings Categories" },
  "标题": { vi: "Tiêu đề", en: "Title" },
  "确认": { vi: "Xác nhận", en: "Confirm" },
  "菜单": { vi: "Trình đơn (Menu)", en: "Menu" },
  "操作按钮": { vi: "Nút thao tác", en: "Action Buttons" },
  "我知道了": { vi: "Đã hiểu", en: "Got It" },
  "请选择": { vi: "Vui lòng chọn", en: "Please select" },
  "选择": { vi: "Chọn", en: "Select" },
  "不可用": { vi: "Không khả dụng", en: "Unavailable" },
  "搜索结果为空": { vi: "Không tìm thấy kết quả phù hợp", en: "No results found" },
  "加载中...": { vi: "Đang tải dữ liệu...", en: "Loading..." },
  "没有更多了": { vi: "Đã hiển thị hết danh sách", en: "No more items" },
  "查看更多": { vi: "Xem thêm", en: "View More" },
  "复制成功": { vi: "Đã sao chép vào bộ nhớ tạm", en: "Copied to clipboard" },
  "新": { vi: "Mới", en: "NEW" },

  // =========================================================================
  // 2. THANH ĐIỀU HƯỚNG, MENU MỞ RỘNG & TIỆN ÍCH (SIDEBAR & MORE APPS)
  // =========================================================================
  "消息": { vi: "Tin nhắn", en: "Messages" },
  "联系人": { vi: "Danh bạ", en: "Contacts" },
  "空间": { vi: "Nhật ký (Qzone)", en: "Qzone" },
  "QQ空间": { vi: "Nhật ký (Qzone)", en: "Qzone" },
  "频道": { vi: "Kênh cộng đồng", en: "Channels" },
  "腾讯频道": { vi: "Kênh cộng đồng Tencent", en: "Tencent Channels" },
  "游戏": { vi: "Trò chơi", en: "Games" },
  "游戏中心": { vi: "Trung tâm Game", en: "Game Center" },
  "设置": { vi: "Cài đặt", en: "Settings" },
  "更多功能": { vi: "Thêm tính năng", en: "More Features" },
  "已添加功能": { vi: "Tính năng đã ghim trên thanh bên", en: "Pinned Features" },
  "未添加功能": { vi: "Tính năng khác (Chưa ghim)", en: "More Available Features" },
  "QQ农场": { vi: "Nông trại QQ", en: "QQ Farm" },
  "农场": { vi: "Nông trại QQ", en: "QQ Farm" },
  "小说": { vi: "Đọc truyện (Tiểu thuyết)", en: "Novels & Books" },
  "自选股": { vi: "Bảng giá Chứng khoán", en: "Stocks Watchlist" },
  "腾讯网": { vi: "Cổng tin tức Tencent (QQ.com)", en: "Tencent News" },
  "QQ钱包": { vi: "Ví điện tử QQ Wallet", en: "QQ Wallet" },
  "腾讯视频": { vi: "Xem phim Tencent Video", en: "Tencent Video" },
  "调色盘": { vi: "Đổi chủ đề & Màu sắc", en: "Theme Palette" },
  "帮助": { vi: "Trung tâm Trợ giúp", en: "Help Center" },
  "退出账号": { vi: "Đăng xuất tài khoản", en: "Log Out" },
  "搜索": { vi: "Tìm kiếm", en: "Search" },
  "好友": { vi: "Bạn bè", en: "Friends" },
  "朋友": { vi: "Bạn bè", en: "Friends" },
  "群聊": { vi: "Nhóm chat", en: "Groups" },
  "设备": { vi: "Thiết bị", en: "Devices" },
  "我的设备": { vi: "Thiết bị của tôi", en: "My Devices" },
  "通讯录": { vi: "Danh bạ", en: "Contacts" },
  "联系人列表": { vi: "Danh sách liên hệ", en: "Contact List" },
  "好友管理器": { vi: "Quản lý danh bạ bạn bè", en: "Contact Manager" },
  "通知列表": { vi: "Danh sách thông báo", en: "Notifications" },
  "新朋友": { vi: "Lời mời kết bạn", en: "New Friends" },
  "新群聊": { vi: "Thông báo nhóm chat", en: "Group Notices" },
  "好友通知": { vi: "Lời mời kết bạn", en: "Friend Requests" },
  "群通知": { vi: "Thông báo nhóm", en: "Group Notices" },
  "群聊通知": { vi: "Thông báo quản trị nhóm", en: "Group Notices" },
  "已过滤的通知": { vi: "Lời mời đã lọc tự động", en: "Filtered Requests" },
  "清空所有通知": { vi: "Xóa tất cả thông báo", en: "Clear All Notifications" },
  "你可能认识他们": { vi: "Gợi ý kết bạn (Có thể bạn quen)", en: "People You May Know" },
  "更多群聊": { vi: "Khám phá thêm các nhóm chat", en: "Discover More Groups" },
  "请求加为好友": { vi: "Muốn kết bạn với bạn", en: "Sent you a friend request" },
  "加入": { vi: "Tham gia", en: "Join" },
  "添加": { vi: "Kết bạn", en: "Add" },
  "我的其他设备": { vi: "Thiết bị khác của tôi", en: "My Other Devices" },
  "我的手机": { vi: "Điện thoại của tôi", en: "My Phone" },
  "我的平板": { vi: "Máy tính bảng của tôi", en: "My Tablet" },
  "文件传输助手": { vi: "Truyền tệp tin (Cloud của tôi)", en: "File Transfer" },
  "群助手": { vi: "Gom nhóm ít tương tác", en: "Group Assistant" },
  "小程序": { vi: "Tiện ích mở rộng (MiniApp)", en: "Mini Programs" },
  "腾讯文档": { vi: "Tài liệu trực tuyến (Docs)", en: "Tencent Docs" },
  "微云": { vi: "Ổ đĩa đám mây Weiyun", en: "Weiyun Drive" },
  "QQ邮箱": { vi: "Hộp thư QQ Mail", en: "QQ Mail" },
  "QQ音乐": { vi: "Nghe nhạc QQ Music", en: "QQ Music" },
  "短视频": { vi: "Video ngắn", en: "Short Videos" },
  "小世界": { vi: "Khám phá (Small World)", en: "Explore" },
  "收藏": { vi: "Đã lưu (Bộ sưu tập)", en: "Saved Items" },
  "我的收藏": { vi: "Bộ sưu tập của tôi", en: "My Favorites" },
  "文件管理器": { vi: "Quản lý tệp tin", en: "File Manager" },
  "机器人": { vi: "Trợ lý Bot", en: "Bots" },
  "更多": { vi: "Thêm", en: "More" },
  "收起": { vi: "Thu gọn", en: "Collapse" },
  "展开": { vi: "Mở rộng", en: "Expand" },

  // =========================================================================
  // 3. MENU CÀI ĐẶT BÊN TRÁI (SETTINGS SIDEBAR)
  // =========================================================================
  "通用": { vi: "Cài đặt chung", en: "General" },
  "消息通知": { vi: "Thông báo tin nhắn", en: "Notifications" },
  "存储管理": { vi: "Dung lượng & Dữ liệu", en: "Data & Storage" },
  "快捷键": { vi: "Phím tắt", en: "Shortcuts" },
  "权限设置": { vi: "Quyền riêng tư & Cấp quyền", en: "Privacy & Permissions" },
  "隐私": { vi: "Quyền riêng tư", en: "Privacy" },
  "隐私设置": { vi: "Cài đặt riêng tư", en: "Privacy Settings" },
  "登录设置": { vi: "Tùy chọn đăng nhập", en: "Login Options" },
  "账号绑定与授权": { vi: "Liên kết & Ủy quyền tài khoản", en: "Linked Accounts & Auth" },
  "账号与安全": { vi: "Tài khoản & Bảo mật", en: "Account & Security" },
  "超级调色盘": { vi: "Giao diện & Chủ đề", en: "Themes & Appearance" },
  "关于": { vi: "Thông tin phiên bản", en: "About QQ" },
  "关于QQ": { vi: "Giới thiệu QQ", en: "About QQ" },
  "插件列表查看": { vi: "Chợ tiện ích (Plugin Store)", en: "Plugin Store" },

  // =========================================================================
  // 4. TRANG CÀI ĐẶT CHUNG (通用 - GENERAL SETTINGS - ĐẦY ĐỦ 100%)
  // =========================================================================
  "界面模式": { vi: "Bố cục cửa sổ ứng dụng", en: "Interface Layout Mode" },
  "效率模式": { vi: "Chế độ Hiện đại (Gộp chung 1 cửa sổ)", en: "Efficiency Mode (Unified Window)" },
  "经典模式": { vi: "Chế độ Cổ điển (Thanh danh bạ dọc tách rời)", en: "Classic Mode (Separate Contact List)" },
  "外观": { vi: "Giao diện hiển thị", en: "Appearance" },
  "外观设置": { vi: "Tùy chỉnh giao diện", en: "Appearance" },
  "外观设置列表": { vi: "Chế độ sáng tối", en: "Theme Appearance" },
  "主题模式": { vi: "Chế độ màu sắc", en: "Color Mode" },
  "跟随系统": { vi: "Tự động theo Windows", en: "Follow System" },
  "跟随系统设置切换浅色或深色模式": { vi: "Tự động chuyển giao diện Sáng/Tối theo cài đặt của Windows", en: "Automatically switch Light/Dark mode with Windows" },
  "浅色": { vi: "Giao diện Sáng", en: "Light" },
  "白天模式": { vi: "Chế độ Ban ngày", en: "Light Mode" },
  "深色": { vi: "Giao diện Tối", en: "Dark" },
  "夜间模式": { vi: "Chế độ Ban đêm", en: "Dark Mode" },
  "切换色彩主题": { vi: "Đổi bảng màu chủ đề", en: "Switch Color Theme" },
  "个性化": { vi: "Cá nhân hóa trang trí", en: "Personalization" },
  "铭牌": { vi: "Huy hiệu tên (Nameplate)", en: "Nameplate" },
  "聊天气泡": { vi: "Kiểu bong bóng chat", en: "Chat Bubbles" },
  "聊天": { vi: "Khung trò chuyện", en: "Chat" },
  "聊天设置": { vi: "Tùy chọn khung trò chuyện", en: "Chat Preferences" },
  "字体大小": { vi: "Cỡ chữ hiển thị", en: "Font Size" },
  "字体": { vi: "Phông chữ", en: "Font Family" },
  "默认字体": { vi: "Phông chữ mặc định", en: "System Default" },
  "微软雅黑": { vi: "Microsoft YaHei", en: "Microsoft YaHei" },
  "标准": { vi: "Tiêu chuẩn", en: "Medium" },
  "小": { vi: "Nhỏ", en: "Small" },
  "大": { vi: "Lớn", en: "Large" },
  "超大": { vi: "Rất lớn", en: "Extra Large" },
  "会话列表": { vi: "Danh sách trò chuyện", en: "Conversation List" },
  "双击会话打开独立窗口": { vi: "Nhấp đúp vào cuộc trò chuyện để tách ra cửa sổ riêng", en: "Double-click chat to open in separate window" },
  "仅效率模式生效": { vi: "Chỉ có tác dụng khi đang dùng Chế độ Hiện đại", en: "Only applies in Efficiency Mode" },
  "打开新聊天窗口的方式": { vi: "Cách mở cửa sổ trò chuyện mới", en: "How to open new chat windows" },
  "自动合并窗口": { vi: "Tự động gộp chung vào một cửa sổ", en: "Automatically merge into tabs" },
  "在独立窗口打开": { vi: "Tách thành các cửa sổ độc lập", en: "Open in separate windows" },
  "已选中 自动合并窗口": { vi: "Đang chọn: Tự động gộp chung vào một cửa sổ", en: "Selected: Auto-merge into tabs" },
  "已选中 在独立窗口打开": { vi: "Đang chọn: Tách thành các cửa sổ độc lập", en: "Selected: Open in separate windows" },
  "双击头像戳一戳": { vi: "Nhấp đúp vào ảnh đại diện để Chọc bạn bè", en: "Double-click avatar to Nudge" },
  "开启后，在聊天窗口双击好友头像即可戳一戳对方": { vi: "Cho phép nhấp đúp vào ảnh đại diện trong khung chat để gửi hiệu ứng nhắc nhở", en: "Double-click a friend's avatar in chat to send a nudge" },
  "展开表情联想": { vi: "Gợi ý nhãn dán khi đang gõ chữ", en: "Show sticker suggestions while typing" },
  "根据输入内容推荐表情": { vi: "Tự động gợi ý nhãn dán phù hợp với nội dung đang nhập", en: "Suggest stickers based on words you type" },
  "使用“/”快捷打开": { vi: "Gõ dấu \"/\" trong ô nhập tin nhắn để mở nhanh", en: "Type \"/\" in chat input to open quickly" },
  "- 指令内容": { vi: "- Lệnh tắt hoặc biểu cảm", en: "- Quick command or sticker" },
  "已选中 表情": { vi: "Đang chọn: Nhãn dán biểu cảm", en: "Selected: Stickers" },
  "机器人指令": { vi: "Lệnh gọi Bot trong nhóm", en: "Bot Commands" },
  "已选中 机器人指令": { vi: "Đang chọn: Lệnh gọi Bot trong nhóm", en: "Selected: Bot Commands" },
  "生成文字表情": { vi: "Tạo nhãn dán chữ nhanh", en: "Generate text stickers" },
  "输入框快捷键": { vi: "Phím tắt gửi tin nhắn", en: "Send Message Shortcut" },
  "已选中 Enter": { vi: "Đang chọn: Phím Enter", en: "Selected: Enter" },
  "已选中 Ctrl+Enter": { vi: "Đang chọn: Tổ hợp Ctrl + Enter", en: "Selected: Ctrl + Enter" },
  "按Enter键发送消息": { vi: "Nhấn phím Enter để gửi", en: "Press Enter to send" },
  "按Ctrl+Enter键发送消息": { vi: "Nhấn tổ hợp Ctrl + Enter để gửi", en: "Press Ctrl + Enter to send" },
  "主面板": { vi: "Cửa sổ chính", en: "Main Window" },
  "停靠在桌面边缘时自动隐藏": { vi: "Tự động trượt ẩn khi kéo cửa sổ sát mép màn hình", en: "Auto-hide when docked to screen edge" },
  "在桌面任务栏显示QQ图标": { vi: "Hiển thị biểu tượng QQ trên thanh Taskbar dưới đáy màn hình", en: "Show QQ icon on Windows Taskbar" },
  "关闭主面板": { vi: "Khi đóng cửa sổ chính", en: "When closing main window" },
  "关闭主面板时": { vi: "Khi đóng cửa sổ chính", en: "When closing main window" },
  "关闭QQ时": { vi: "Khi bấm nút X đóng cửa sổ QQ", en: "When closing QQ window" },
  "最小化至托盘": { vi: "Thu nhỏ xuống khay hệ thống (vẫn nhận tin nhắn)", en: "Minimize to system tray" },
  "已选中 最小化至托盘": { vi: "Đang chọn: Thu nhỏ xuống khay hệ thống", en: "Selected: Minimize to system tray" },
  "已选中 退出程序": { vi: "Đang chọn: Thoát hoàn toàn ứng dụng", en: "Selected: Exit program completely" },
  "隐藏到任务栏通知区域，不退出程序": { vi: "Thu nhỏ xuống khay hệ thống góc phải (vẫn nhận tin nhắn)", en: "Minimize to system tray (keep running)" },
  "隐藏到系统托盘": { vi: "Thu nhỏ xuống khay hệ thống", en: "Minimize to system tray" },
  "退出程序": { vi: "Thoát hoàn toàn ứng dụng QQ", en: "Exit application completely" },
  "安全设置": { vi: "Bảo mật liên kết web", en: "Link Security" },
  "使用QQ浏览器打开QQ中的链接，增强访问网络的安全性。": { vi: "Mở liên kết trong chat bằng QQ Browser để tăng cường bảo mật mạng.", en: "Open chat links in QQ Browser for enhanced security." },
  "建议": { vi: "Gợi ý: ", en: "Tip: " },
  "安装QQ浏览器": { vi: "Cài đặt trình duyệt QQ Browser", en: "Install QQ Browser" },
  "，增强访问网络的安全性。": { vi: " để kiểm tra an toàn khi mở liên kết lạ.", en: " to enhance web browsing security." },
  "浏览": { vi: "Trình duyệt & Tài liệu", en: "Browsing & Documents" },
  "使用系统默认浏览器打开网页": { vi: "Mở liên kết web bằng trình duyệt mặc định của máy tính (Chrome/Edge...)", en: "Open web links in your default system browser" },
  "使用内置浏览器打开网页": { vi: "Mở liên kết web bằng cửa sổ trình duyệt tích hợp của QQ", en: "Open links using QQ's built-in browser" },
  "使用内置查看器打开本地文档": { vi: "Dùng trình đọc tích hợp của QQ để xem nhanh tệp tài liệu trên máy", en: "Open local documents with QQ's built-in viewer" },
  "支持doc、docx、xls、xlsx、ppt、pptx、pdf、txt等": { vi: "Hỗ trợ xem các tệp Word, Excel, PowerPoint, PDF, TXT...", en: "Supports doc, docx, xls, xlsx, ppt, pptx, pdf, txt, etc." },
  "使用内置查看器打开在线文档": { vi: "Dùng trình đọc tích hợp của QQ để mở tài liệu trực tuyến", en: "Open online documents with built-in viewer" },
  "拖拽文件时打开闪传悬浮窗": { vi: "Hiện khung truyền tệp nhanh (Flash Transfer) khi kéo thả tệp", en: "Show Flash Transfer float window when dragging files" },
  "顶栏工具": { vi: "Tiện ích thanh tiêu đề trên cùng", en: "Top Header Tools" },
  "天气": { vi: "Hiển thị dự báo thời tiết", en: "Weather Widget" },
  "系统设置": { vi: "Tích hợp vào Windows", en: "Windows Integration" },
  "支持右键桌面QQ图标时发送文件": { vi: "Thêm mục gửi tệp nhanh vào menu chuột phải của Windows", en: "Add 'Send via QQ' to Windows right-click menu" },
  "右键菜单增加“通过QQ发送”选项，支持发送至我的手机与好友，或打开闪传": { vi: "Khi bấm chuột phải vào tệp bất kỳ trên máy tính sẽ có thêm mục \"Gửi qua QQ\" sang điện thoại hoặc cho bạn bè", en: "Right-click any file in Windows Explorer to send it directly to your phone or friends via QQ" },
  "其他": { vi: "Hiệu ứng & Khác", en: "Other Visual Options" },
  "透明效果": { vi: "Hiệu ứng nền kính mờ (Mica/Acrylic)", en: "Translucent Blur Effect" },
  "窗口和表面显示半透明": { vi: "Làm mờ bán trong suốt phần nền cửa sổ QQ theo phong cách Windows 11", en: "Enable translucent acrylic background on QQ windows" },
  "软件更新": { vi: "Cập nhật phần mềm", en: "Software Updates" },
  "有新版本时自动安装QQ": { vi: "Tự động tải về và nâng cấp khi có phiên bản QQ mới", en: "Automatically download and install QQ updates" },
  "启动与更新": { vi: "Khởi động & Cập nhật", en: "Startup & Updates" },
  "开机自启": { vi: "Khởi động cùng Windows", en: "Launch at Startup" },
  "开机时自动启动QQ": { vi: "Tự động mở QQ khi bật máy tính", en: "Launch QQ automatically when Windows starts" },
  "自动更新": { vi: "Tự động cập nhật", en: "Auto-Update" },
  "有新版本时自动安装更新": { vi: "Tự động tải và nâng cấp khi có phiên bản mới", en: "Automatically download and install new versions" },
  "硬件加速": { vi: "Tăng tốc phần cứng (GPU)", en: "Hardware Acceleration" },
  "开启硬件加速": { vi: "Sử dụng card đồ họa giúp giao diện mượt hơn (cần khởi động lại QQ)", en: "Use GPU acceleration for smoother rendering (requires restart)" },
  "侧边栏管理": { vi: "Tùy chỉnh thanh công cụ bên trái", en: "Customize Left Sidebar" },
  "左侧边栏管理": { vi: "Ẩn/hiện các mục trên thanh bên trái", en: "Manage Left Sidebar Icons" },

  // =========================================================================
  // 5. TRANG THÔNG BÁO TIN NHẮN (消息通知 - NOTIFICATIONS - ĐẦY ĐỦ 100%)
  // =========================================================================
  "桌面弹窗提醒": { vi: "Thông báo nổi ở góc màn hình", en: "Desktop Banner Notifications" },
  "通知类型": { vi: "Kiểu hiển thị thông báo", en: "Notification Style" },
  "Windows通知": { vi: "Thông báo chuẩn của Windows", en: "Windows System Notification" },
  "已选中 Windows通知": { vi: "Đang chọn: Thông báo chuẩn của Windows", en: "Selected: Windows System Notification" },
  "QQ通知": { vi: "Khung thông báo riêng của QQ", en: "QQ Built-in Banner" },
  "已选中 QQ通知": { vi: "Đang chọn: Khung thông báo riêng của QQ", en: "Selected: QQ Built-in Banner" },
  "关闭通知": { vi: "Tắt thông báo nổi", en: "Turn Off Banners" },
  "通知显示消息详情": { vi: "Hiển thị nội dung tin nhắn trên thông báo", en: "Show Message Preview" },
  "关闭后不会显示具体消息内容": { vi: "Khi tắt sẽ ẩn nội dung chi tiết để bảo mật quyền riêng tư", en: "Hides message text in banners for privacy when turned off" },
  "好友消息": { vi: "Tin nhắn cá nhân (Bạn bè)", en: "Direct Messages" },
  "包括好友申请通知等": { vi: "Bao gồm lời mời kết bạn và phản hồi xác nhận", en: "Includes friend requests and verifications" },
  "群聊消息": { vi: "Tin nhắn trong nhóm chat", en: "Group Messages" },
  "包括加群申请通知等": { vi: "Bao gồm yêu cầu xin vào nhóm, lời mời vào nhóm...", en: "Includes group join requests and invitations" },
  "频道消息": { vi: "Tin nhắn từ các Kênh theo dõi", en: "Channel Updates" },
  "频道通知": { vi: "Thông báo hoạt động Kênh", en: "Channel Notifications" },
  "新邮件提醒": { vi: "Báo khi có thư mới trong QQ Mail", en: "New QQ Mail Alerts" },
  "运营活动提醒": { vi: "Thông báo sự kiện & tin tức hệ thống", en: "System Events & News" },
  "左侧边栏应用提醒": { vi: "Chấm đỏ thông báo trên thanh công cụ trái", en: "Sidebar App Badges" },
  "展示农场提醒详情": { vi: "Hiển thị thông báo thu hoạch Nông trại QQ", en: "Show QQ Farm harvest alerts" },
  "托盘与消息盒子提醒": { vi: "Hiệu ứng báo tin ở khay hệ thống (System Tray)", en: "System Tray & Message Box Alerts" },
  "头像闪动": { vi: "Nhấp nháy ảnh đại diện dưới khay hệ thống khi có tin mới", en: "Blink Tray Icon on New Message" },
  "消息盒子": { vi: "Hiện danh sách thu gọn khi trỏ chuột vào biểu tượng QQ", en: "Show Floating Message Box on Tray Hover" },
  "其他（包括公众号、服务号等其他消息内容）": { vi: "Thông báo khác (Từ các trang tin tức, dịch vụ công cộng...)", en: "Others (Official accounts, service notices, etc.)" },
  "消息提醒设置": { vi: "Tùy chỉnh âm thanh & hiệu ứng rung", en: "Sound & Shake Settings" },
  "窗口抖动": { vi: "Cho phép bạn bè làm rung cửa sổ chat (Buzz/Shake)", en: "Allow Window Shake (Buzz)" },
  "提示音": { vi: "Âm báo tin nhắn", en: "Alert Sounds" },
  "新消息提示音": { vi: "Phát âm thanh khi có tin nhắn mới đến", en: "Play Sound on New Message" },
  "群消息提醒设置": { vi: "Quản lý thông báo riêng cho từng nhóm chat", en: "Per-Group Notification Rules" },
  "将选中项设置为": { vi: "Đặt chế độ thông báo cho nhóm đang chọn:", en: "Set notification rule for selected group:" },
  "已选中 接收并提醒": { vi: "Đang chọn: Nhận tin nhắn và phát chuông báo", en: "Selected: Receive and Notify" },
  "接收并提醒": { vi: "Nhận tin nhắn và phát chuông báo", en: "Receive and Notify" },
  "接收但不提醒": { vi: "Nhận tin nhắn nhưng tắt chuông báo", en: "Receive Quietly (Mute)" },
  "收进群助手且不提醒": { vi: "Đưa vào mục Gom nhóm ít tương tác (Tắt chuông)", en: "Move to Group Assistant & Mute" },
  "屏蔽群消息": { vi: "Chặn hoàn toàn tin nhắn từ nhóm này", en: "Block Group Messages" },
  "声音提醒": { vi: "Âm thanh chuông báo", en: "Notification Sounds" },
  "开启声音": { vi: "Bật âm thanh khi có thông báo mới", en: "Play Notification Sounds" },
  "消息提示音": { vi: "Âm báo tin nhắn mới", en: "Message Alert Tone" },
  "好友消息提示音": { vi: "Âm báo tin nhắn bạn bè", en: "Friend Message Tone" },
  "群聊消息提示音": { vi: "Âm báo tin nhắn nhóm", en: "Group Message Tone" },
  "通话铃声": { vi: "Nhạc chuông cuộc gọi đến", en: "Incoming Call Ringtone" },
  "经典": { vi: "Cổ điển (Tiếng ho đặc trưng)", en: "Classic QQ" },
  "清脆": { vi: "Trong trẻo", en: "Crisp" },
  "气泡": { vi: "Tiếng bọt nước", en: "Bubble" },
  "无": { vi: "Không phát âm thanh", en: "None" },
  "新消息声音提醒": { vi: "Phát tiếng chuông khi có tin nhắn đến", en: "Play sound on new message" },
  "好友上线提醒": { vi: "Báo âm thanh khi bạn bè vừa trực tuyến", en: "Friend Online Sound" },
  "特别关心提示音": { vi: "Chuông báo riêng cho Bạn bè đặc biệt", en: "Special Care Ringtone" },
  "任务栏图标闪烁": { vi: "Nhấp nháy biểu tượng QQ dưới thanh Taskbar", en: "Flash Taskbar Icon on New Message" },

  // =========================================================================
  // 6. TRANG DUNG LƯỢNG & DỮ LIỆU (存储管理 - STORAGE - ĐẦY ĐỦ 100%)
  // =========================================================================
  "保存位置": { vi: "Thư mục lưu trữ trên máy tính", en: "Storage Locations" },
  "将QQ内接收或下载的文件保存到": { vi: "Lưu các tệp tin và hình ảnh tải về trong QQ tại:", en: "Save received and downloaded files to:" },
  "更改存储路径": { vi: "Đổi thư mục lưu trữ", en: "Change Folder" },
  "聊天消息默认保存到": { vi: "Cơ sở dữ liệu tin nhắn trò chuyện đang lưu tại:", en: "Chat database is stored at:" },
  "存储空间": { vi: "Thống kê dung lượng sử dụng", en: "Storage Usage" },
  "文件自动备份": { vi: "Tự động tải về & Sao lưu tệp tin", en: "Auto-Download Files" },
  "自动下载小于": { vi: "Tự động tải các tệp tin nhỏ hơn", en: "Auto-download files under" },
  "MB的文件": { vi: "MB khi nhận được trong khung chat", en: "MB in chats" },
  "自动下载小于指定大小的文件": { vi: "Tự động tải về máy các tệp tin nhỏ hơn dung lượng giới hạn ở trên", en: "Automatically download files smaller than the specified limit" },
  "自动下载指定好友的文件": { vi: "Tự động tải mọi tệp tin gửi từ các bạn bè được chỉ định", en: "Automatically download all files sent by specific friends" },
  "未选择好友": { vi: "Chưa chọn người bạn nào", en: "No friends selected" },
  "文件管理": { vi: "Quản lý tệp tải về", en: "File Management" },
  "存储路径": { vi: "Vị trí lưu trữ trên ổ cứng", en: "Storage Location" },
  "文件保存路径": { vi: "Thư mục lưu các tệp tải về", en: "Downloads Folder" },
  "聊天记录存储路径": { vi: "Thư mục gốc lưu dữ liệu tài khoản", en: "Account Data Folder" },
  "默认将接收到的文件保存在此文件夹中": { vi: "Tất cả tệp tin và ảnh bạn tải về trong khung chat sẽ nằm tại đây", en: "Received files will be saved in this folder by default" },
  "更改": { vi: "Đổi vị trí", en: "Change" },
  "更改目录": { vi: "Đổi thư mục lưu", en: "Change Folder" },
  "打开文件夹": { vi: "Mở thư mục", en: "Open Folder" },
  "打开目录": { vi: "Mở thư mục", en: "Open Folder" },
  "缓存清理": { vi: "Giải phóng bộ nhớ đệm", en: "Cache Cleanup" },
  "清空缓存": { vi: "Xóa bộ nhớ đệm", en: "Clear Cache" },
  "清理缓存": { vi: "Dọn dẹp bộ nhớ đệm", en: "Clean Cache" },
  "清理": { vi: "Dọn dẹp ngay", en: "Clean Up" },
  "缓存数据包括临时图片、视频、网页等，清理后不影响正常使用": { vi: "Bao gồm ảnh xem trước, bộ nhớ tạm... Xóa đi giúp nhẹ máy mà không làm mất tin nhắn", en: "Temporary thumbnails and web cache. Clearing will not delete your chats" },
  "聊天数据管理": { vi: "Quản lý lịch sử trò chuyện", en: "Chat History Management" },
  "聊天记录管理": { vi: "Sao lưu & Xóa lịch sử chat", en: "Manage Chat History" },
  "迁移": { vi: "Chuyển sang ổ đĩa khác", en: "Move Data" },
  "备份与恢复": { vi: "Sao lưu & Khôi phục dữ liệu", en: "Backup & Restore" },
  "备份聊天记录": { vi: "Sao lưu tin nhắn vào máy tính", en: "Backup Chats to PC" },
  "恢复聊天记录": { vi: "Khôi phục tin nhắn từ bản sao lưu", en: "Restore Chats from Backup" },
  "导入聊天记录": { vi: "Nhập lịch sử trò chuyện", en: "Import Chat History" },
  "导出聊天记录": { vi: "Xuất lịch sử trò chuyện", en: "Export Chat History" },
  "清空全部聊天记录": { vi: "Xóa sạch toàn bộ lịch sử trò chuyện", en: "Delete All Chat History" },
  "自动下载": { vi: "Tự động tải tệp đính kèm", en: "Auto-Download" },
  "自动接收文件": { vi: "Tự động tải về các tệp tin dung lượng nhỏ (< 20MB)", en: "Automatically download files smaller than 20MB" },
  "以只读方式打开文件": { vi: "Mở tệp văn bản ở chế độ Chỉ đọc (Tránh sửa nhầm bản gốc)", en: "Open received documents in Read-Only mode" },
  "以只读方式打开聊天中的文件": { vi: "Mở tệp nhận được ở chế độ Chỉ đọc", en: "Open chat files in Read-Only mode" },
  "计算中...": { vi: "Đang thống kê dung lượng...", en: "Calculating..." },
  "正在计算...": { vi: "Đang tính toán...", en: "Calculating..." },
  "已用空间": { vi: "Dung lượng QQ đang chiếm", en: "QQ Storage Used" },
  "可用空间": { vi: "Dung lượng ổ cứng còn trống", en: "Free Disk Space" },
  "聊天记录": { vi: "Lịch sử trò chuyện", en: "Chat History" },
  "缓存文件": { vi: "Bộ nhớ đệm (Cache)", en: "Cached Files" },
  "接收的文件": { vi: "Tệp tin đã nhận", en: "Received Files" },
  "其他数据": { vi: "Dữ liệu hệ thống khác", en: "Other Data" },

  // =========================================================================
  // 7. TRANG PHÍM TẮT (快捷键 - SHORTCUTS - ĐẦY ĐỦ 100%)
  // =========================================================================
  "全局快捷键": { vi: "Phím tắt toàn hệ thống", en: "Global Shortcuts" },
  "发送消息": { vi: "Gửi tin nhắn", en: "Send Message" },
  "提取消息": { vi: "Mở nhanh tin nhắn chưa đọc", en: "Pop Up Unread Message" },
  "打开最新未读消息窗口": { vi: "Mở cửa sổ có tin nhắn mới chưa đọc", en: "Open Latest Unread Chat Window" },
  "点击设置快捷键": { vi: "Bấm vào đây để gán phím tắt", en: "Click to assign shortcut" },
  "语音输入文字": { vi: "Đọc giọng nói thành văn bản", en: "Voice-to-Text Input" },
  "在QQ内按住": { vi: "Trong cửa sổ QQ, nhấn giữ phím", en: "Hold key inside QQ" },
  "在QQ内按下开始，再按结束": { vi: "Nhấn 1 lần để bắt đầu thu âm, nhấn lần nữa để dừng", en: "Press once to start recording, press again to stop" },
  "防止快捷键冲突，可设置": { vi: "Để tránh trùng phím, bạn có thể đổi sang phím khác:", en: "To prevent conflicts, customize key:" },
  "打开主面板": { vi: "Ẩn / Hiện cửa sổ chính QQ", en: "Toggle Main QQ Window" },
  "屏幕截图": { vi: "Chụp ảnh màn hình", en: "Take Screenshot" },
  "截图时隐藏当前窗口": { vi: "Ẩn cửa sổ QQ khi đang chụp màn hình", en: "Hide QQ window while taking screenshot" },
  "提取文字": { vi: "Quét lấy chữ trên màn hình (OCR)", en: "Extract Screen Text (OCR)" },
  "屏幕翻译": { vi: "Dịch nhanh vùng màn hình", en: "Screen Translation" },
  "录屏": { vi: "Quay video màn hình", en: "Screen Recording" },
  "长截图": { vi: "Chụp ảnh cuộn trang dài", en: "Scrolling Screenshot" },
  "锁定": { vi: "Khóa màn hình QQ", en: "Lock QQ" },
  "锁定QQ": { vi: "Khóa tạm thời ứng dụng QQ", en: "Lock QQ Client" },
  "打开或隐藏QQ所有窗口": { vi: "Ẩn / Hiện toàn bộ các cửa sổ của QQ", en: "Show / Hide All QQ Windows" },
  "打开或隐藏迷你窗": { vi: "Ẩn / Hiện cửa sổ thu gọn (Mini)", en: "Show / Hide Mini Window" },
  "打开闪传": { vi: "Mở cửa sổ truyền tệp nhanh (Flash Transfer)", en: "Open Flash Transfer" },
  "打开消息列表页": { vi: "Chuyển sang tab Tin nhắn", en: "Switch to Messages Tab" },
  "打开联系人列表页": { vi: "Chuyển sang tab Danh bạ", en: "Switch to Contacts Tab" },
  "打开QQ好友搜索框": { vi: "Mở nhanh ô Tìm kiếm bạn bè & nhóm", en: "Focus Search Box" },
  "更多快捷键": { vi: "Các phím tắt thao tác khác", en: "Additional Shortcuts" },
  "使用 \"Ctrl+W\" 移除列表选中的会话": { vi: "Cho phép nhấn \"Ctrl + W\" để đóng cuộc trò chuyện đang mở", en: "Use \"Ctrl + W\" to close active conversation" },
  "快捷键冲突提醒": { vi: "Hiển thị cảnh báo khi phím tắt bị trùng với phần mềm khác", en: "Notify when shortcuts conflict with other apps" },
  "打开全部消息": { vi: "Mở tất cả cửa sổ tin nhắn mới", en: "Open All Unread Chats" },
  "恢复默认": { vi: "Khôi phục mặc định", en: "Reset to Default" },
  "恢复默认设置": { vi: "Đặt lại toàn bộ phím tắt về mặc định", en: "Reset All Shortcuts to Default" },
  "热键冲突": { vi: "Trùng phím tắt với phần mềm khác", en: "Shortcut Key Conflict" },
  "无快捷键": { vi: "Chưa gán phím tắt", en: "None" },

  // =========================================================================
  // 8. TRANG CẤP QUYỀN & TRUY CẬP TỪ XA (权限设置 - PERMISSIONS - ĐẦY ĐỦ 100%)
  // =========================================================================
  "好友权限": { vi: "Phương thức kết bạn", en: "Friend Request Rules" },
  "加我为好友时": { vi: "Khi người khác gửi lời mời kết bạn", en: "When someone adds me as a friend" },
  "加我为好友时的验证方式": { vi: "Cách thức phê duyệt khi có người muốn kết bạn với bạn", en: "Verification required when someone adds you" },
  "已选中 需要验证信息": { vi: "Đang chọn: Yêu cầu gửi lời nhắn làm quen", en: "Selected: Require verification message" },
  "已选中 允许任何人": { vi: "Đang chọn: Tự động chấp nhận tất cả", en: "Selected: Allow anyone" },
  "已选中 需要正确回答问题": { vi: "Đang chọn: Phải trả lời đúng câu hỏi", en: "Selected: Require answering question" },
  "已选中 需要回答问题并由我确认": { vi: "Đang chọn: Trả lời câu hỏi và chờ tôi duyệt", en: "Selected: Answer question & wait for approval" },
  "已选中 拒绝任何人添加": { vi: "Đang chọn: Từ chối mọi lời mời kết bạn", en: "Selected: Reject all requests" },
  "允许任何人": { vi: "Tự động đồng ý tất cả (Không cần duyệt)", en: "Allow Anyone Automatically" },
  "需要验证信息": { vi: "Yêu cầu gửi lời nhắn làm quen để tôi duyệt", en: "Require Verification Message" },
  "需要正确回答问题": { vi: "Yêu cầu trả lời đúng câu hỏi bảo mật", en: "Require Answering Security Question" },
  "需要回答问题并由我确认": { vi: "Trả lời câu hỏi và chờ tôi phê duyệt", en: "Answer Question & Wait for My Approval" },
  "拒绝任何人添加": { vi: "Từ chối tất cả lời mời kết bạn", en: "Reject All Friend Requests" },
  "设置问题": { vi: "Câu hỏi đặt ra:", en: "Set Question:" },
  "设置答案": { vi: "Câu trả lời đúng:", en: "Set Answer:" },
  "请输入答案": { vi: "Nhập câu trả lời...", en: "Enter answer..." },
  "问题1": { vi: "Câu hỏi 1", en: "Question 1" },
  "问题2": { vi: "Câu hỏi 2", en: "Question 2" },
  "问题3": { vi: "Câu hỏi 3", en: "Question 3" },
  "问题": { vi: "Câu hỏi", en: "Question" },
  "答案": { vi: "Đáp án", en: "Answer" },
  "远程访问电脑": { vi: "Truy cập tệp máy tính từ điện thoại", en: "Remote PC File Access" },
  "手机设备访问电脑文件": { vi: "Cho phép mở xem các tệp trên máy tính này từ ứng dụng QQ trên điện thoại", en: "Allow your mobile QQ to browse files on this PC" },
  "手机设备访问电脑": { vi: "Hướng dẫn kết nối điện thoại với máy tính", en: "How to Access PC from Phone" },
  "手机远程直连电脑，重要文件随取随用": { vi: "Kết nối trực tiếp từ điện thoại vào ổ cứng máy tính để lấy tệp tin mọi lúc mọi nơi", en: "Connect directly from your phone to retrieve important PC files anytime" },
  "1.找到“我的电脑”": { vi: "1. Tìm mục \"Máy tính của tôi\" (我的电脑) trên điện thoại", en: "1. Find 'My Computer' (我的电脑) on Mobile QQ" },
  "手机QQ，搜索“我的电脑”- 访问电脑文件": { vi: "Mở QQ trên điện thoại, gõ tìm \"我的电脑\" -> Bấm Truy cập tệp máy tính", en: "In Mobile QQ, search '我的电脑' -> Tap Access PC Files" },
  "2.电脑端进行访问授权": { vi: "2. Xác nhận cấp quyền trên máy tính", en: "2. Authorize access on your PC" },
  "点击确认授权，即完成设置": { vi: "Bấm nút xác nhận cấp quyền trên màn hình máy tính là hoàn tất", en: "Click confirm on your PC screen to finish setup" },
  "添加我的方式": { vi: "Cách người khác tìm thấy bạn", en: "How People Can Find Me" },
  "允许通过以下方式找到我": { vi: "Cho phép người khác tìm kiếm tài khoản của tôi qua", en: "Allow others to search for me by" },
  "QQ号": { vi: "Số tài khoản QQ (ID)", en: "QQ ID" },
  "手机号": { vi: "Số điện thoại liên kết", en: "Phone Number" },
  "昵称搜索": { vi: "Tìm theo tên hiển thị", en: "Nickname Search" },
  "二维码": { vi: "Mã QR cá nhân", en: "QR Code" },
  "名片": { vi: "Danh thiếp bạn bè giới thiệu", en: "Shared Contact Card" },
  "临时会话": { vi: "Nhận tin nhắn từ người lạ (Chưa kết bạn)", en: "Messages from Strangers" },
  "接收来自身份未验证好友的消息": { vi: "Cho phép người chưa kết bạn nhắn tin qua nhóm chung", en: "Allow temporary messages from non-friends" },
  "展示我的在线状态": { vi: "Cho phép bạn bè thấy tôi đang Trực tuyến", en: "Show My Online Status" },
  "展示我的输入状态": { vi: "Hiển thị chữ 'Đang gõ tin nhắn...' cho đối phương", en: "Show 'Typing...' Status" },
  "向好友展示我正在输入": { vi: "Cho người bên kia biết khi bạn đang soạn tin trả lời", en: "Let the other person see when you are typing" },
  "黑名单": { vi: "Danh sách chặn (Sổ đen)", en: "Blocked Users" },
  "管理黑名单": { vi: "Xem danh sách người đã chặn", en: "Manage Blocked Users" },
  "已屏蔽的用户": { vi: "Tài khoản đang bị chặn", en: "Blocked Accounts" },
  "移出黑名单": { vi: "Bỏ chặn", en: "Unblock" },
  "暂无黑名单用户": { vi: "Hiện chưa chặn ai", en: "No blocked users" },

  // =========================================================================
  // 9. TRANG ĐĂNG NHẬP & LIÊN KẾT ỦY QUYỀN (登录设置 / 账号绑定与授权)
  // =========================================================================
  "启动设置": { vi: "Tùy chọn khi khởi động máy", en: "Startup Options" },
  "电脑开机后自动启动QQ": { vi: "Tự động mở ứng dụng QQ khi khởi động Windows", en: "Automatically launch QQ when Windows starts" },
  "启动QQ时自动登录账号": { vi: "Tự động đăng nhập vào tài khoản này ngay khi mở QQ", en: "Automatically log into this account when QQ opens" },
  "登录方式": { vi: "Phương thức bảo mật đăng nhập", en: "Login Verification" },
  "退出QQ后使用账号密码或手机扫码登录": { vi: "Sau khi thoát QQ, lần mở tiếp theo cần nhập mật khẩu hoặc quét mã QR trên điện thoại", en: "Require password or mobile QR scan after logging out" },
  "登录验证": { vi: "Xác minh thiết bị tin cậy", en: "Trusted Device Verification" },
  "下次登录无需在手机确认": { vi: "Ghi nhớ máy tính này, lần đăng nhập sau không cần bấm xác nhận lại trên điện thoại", en: "Remember this PC; skip mobile confirmation on future logins" },
  "微信小程序使用授权": { vi: "Liên kết chạy Tiện ích nhỏ WeChat (MiniApp)", en: "WeChat Mini Program Authorization" },
  "微信": { vi: "Tài khoản WeChat", en: "WeChat" },
  "QQ电脑端 · 未授权": { vi: "QQ Máy tính · Chưa cấp quyền", en: "QQ Desktop · Not Authorized" },
  "QQ电脑端 · 已授权": { vi: "QQ Máy tính · Đã cấp quyền", en: "QQ Desktop · Authorized" },
  "授权": { vi: "Cấp quyền liên kết", en: "Authorize" },
  "QQ移动端 · 未授权": { vi: "QQ Điện thoại · Chưa cấp quyền", en: "QQ Mobile · Not Authorized" },
  "QQ移动端 · 已授权": { vi: "QQ Điện thoại · Đã cấp quyền", en: "QQ Mobile · Authorized" },
  "请在QQ移动端授权": { vi: "Vui lòng mở QQ trên điện thoại để cấp quyền", en: "Please authorize in the QQ Mobile app" },
  "仅授权登录微信小程序，不会泄露个人微信账号隐私": { vi: "Chỉ dùng để mở các tiện ích MiniApp của WeChat ngay trên QQ, hoàn toàn không lộ thông tin cá nhân", en: "Only used to run WeChat Mini Programs inside QQ; your WeChat privacy remains protected" },
  "第三方账号授权管理": { vi: "Quản lý các ứng dụng & dịch vụ đã cấp quyền", en: "Third-Party App Authorizations" },
  "小程序、小游戏": { vi: "Tiện ích mở rộng (MiniApp) & Trò chơi nhỏ (MiniGame)", en: "Mini Programs & Mini Games" },
  "自动登录": { vi: "Tự động đăng nhập", en: "Auto Login" },
  "启动QQ时自动登录": { vi: "Tự động vào thẳng tài khoản khi mở QQ", en: "Log in automatically when opening QQ" },
  "开启后，在本机启动QQ将自动登录此账号": { vi: "Không cần quét QR hay nhập lại mật khẩu mỗi lần bật máy", en: "Skip QR scan or password prompt on this computer" },
  "记住密码": { vi: "Lưu mật khẩu", en: "Remember Password" },
  "登录设备管理": { vi: "Thiết bị đang đăng nhập tài khoản này", en: "Logged-in Devices" },
  "已登录设备": { vi: "Danh sách thiết bị đang hoạt động", en: "Active Sessions" },
  "当前设备": { vi: "Máy tính này", en: "Current PC" },
  "本机": { vi: "Thiết bị hiện tại", en: "This Device" },
  "退出登录": { vi: "Đăng xuất tài khoản", en: "Log Out" },
  "下线": { vi: "Đăng xuất khỏi thiết bị này", en: "Sign Out Device" },
  "修改密码": { vi: "Đổi mật khẩu tài khoản", en: "Change Password" },
  "安全中心": { vi: "Trung tâm bảo mật Tencent", en: "Security Center" },
  "QQ安全中心": { vi: "Trung tâm bảo mật QQ", en: "QQ Security Center" },
  "锁定密码": { vi: "Mật khẩu khóa tạm thời QQ", en: "Client Lock Password" },
  "设置锁定密码": { vi: "Tạo mật khẩu khóa màn hình QQ", en: "Set Lock Password" },
  "账号绑定": { vi: "Thông tin liên kết tài khoản", en: "Account Links" },
  "绑定手机": { vi: "Số điện thoại bảo mật", en: "Phone Number" },
  "更换手机": { vi: "Đổi số điện thoại", en: "Change Phone" },
  "已绑定": { vi: "Đã liên kết", en: "Linked" },
  "未绑定": { vi: "Chưa liên kết", en: "Not Linked" },
  "授权管理": { vi: "Ứng dụng & Trang web đã đăng nhập bằng QQ", en: "Authorized Apps & Websites" },
  "互联授权管理": { vi: "Quản lý quyền truy cập bên thứ ba (QQ Connect)", en: "Manage Third-Party Logins" },
  "取消授权": { vi: "Thu hồi quyền truy cập", en: "Revoke Access" },

  // =========================================================================
  // 10. TRANG GIAO DIỆN & CHỦ ĐỀ (超级调色盘 - THEMES & PALETTE - ĐẦY ĐỦ 100%)
  // =========================================================================
  "上传图片": { vi: "Tải ảnh nền từ máy tính", en: "Upload Custom Image" },
  "随心调": { vi: "Tự phối màu chủ đề", en: "Custom Color Mixer" },
  "预览日间": { vi: "Xem thử chế độ Sáng", en: "Preview Light" },
  "预览夜间": { vi: "Xem thử chế độ Tối", en: "Preview Dark" },
  "精品尝鲜": { vi: "Bộ sưu tập Chủ đề nghệ thuật", en: "Featured Art Themes" },
  "感受色彩活力，定制你的QQ主题": { vi: "Trải nghiệm sắc màu sống động và cá nhân hóa giao diện QQ theo phong cách của bạn", en: "Experience vibrant colors and customize your personal QQ theme" },
  "水墨国风": { vi: "Thủy Mặc Cổ Phong", en: "Traditional Ink Wash" },
  "秋水共长天一色": { vi: "Làn nước thu trong hòa cùng sắc trời xanh thẳm", en: "Autumn waters merge with the boundless sky" },
  "神秘美学": { vi: "Sắc Tím Huyền Bí", en: "Mystic Aesthetics" },
  "每天一点甜，生活好运连连": { vi: "Mỗi ngày thêm chút ngọt ngào, may mắn ngập tràn", en: "A little sweetness every day brings endless luck" },
  "缤纷时刻": { vi: "Sắc Màu Rực Rỡ", en: "Colorful Moments" },
  "小小画板上映射生活的美好": { vi: "Bảng màu nhỏ phản chiếu những khoảnh khắc tươi đẹp của cuộc sống", en: "A small palette reflecting the beauty of life" },
  "幻彩机核": { vi: "Cyberpunk Đa Sắc", en: "Cyber Neon" },
  "永不止境的黑夜和炽热不羁的心跳": { vi: "Màn đêm bất tận cùng nhịp đập rực cháy tự do", en: "Endless night and a fiery, untamed heartbeat" },
  "默认主题": { vi: "Giao diện mặc định", en: "Default Themes" },
  "经典白": { vi: "Trắng tinh khôi", en: "Classic Light" },
  "极夜黑": { vi: "Đen huyền bí", en: "Midnight Dark" },
  "自定义颜色": { vi: "Tự phối màu theo sở thích", en: "Custom Palette" },
  "恢复默认主题": { vi: "Về lại giao diện gốc", en: "Reset Theme" },

  // =========================================================================
  // 11. TRANG GIỚI THIỆU, LITELOADER & CHỢ PLUGIN (关于 / LiteLoader / 插件列表)
  // =========================================================================
  "版本: 9.9.36-53644 (64位)": { vi: "Phiên bản: 9.9.36-53644 (64-bit)", en: "Version: 9.9.36-53644 (64-bit)" },
  "基于": { vi: "Xây dựng trên nền tảng ", en: "Built on " },
  "技术架构": { vi: " thế hệ mới", en: " architecture" },
  "当前版本": { vi: "Phiên bản đang dùng", en: "Current Version" },
  "已是最新版本": { vi: "Bạn đang dùng bản mới nhất", en: "Up to Date" },
  "检查更新": { vi: "Kiểm tra bản cập nhật mới", en: "Check for Updates" },
  "更新日志": { vi: "Nội dung cập nhật", en: "Release Notes" },
  "服务协议": { vi: "Điều khoản dịch vụ", en: "Terms of Service" },
  "隐私政策": { vi: "Chính sách bảo mật", en: "Privacy Policy" },
  "问题反馈": { vi: "Báo lỗi & Góp ý", en: "Send Feedback" },
  "LiteLoader 作为 QwQNT 插件运行中": { vi: "LiteLoader đang hoạt động ổn định", en: "LiteLoader is actively running" },
  "暂未发现 LiteLoaderQQNT 有新版本，目前已是最新": { vi: "LiteLoaderQQNT đang ở phiên bản mới nhất", en: "LiteLoaderQQNT is up to date" },
  "重新发现": { vi: "Kiểm tra lại", en: "Check Again" },
  "安装新插件": { vi: "Cài đặt tiện ích (Plugin) mới", en: "Install New Plugin" },
  "支持类型：解压前 zip 格式文件 | 解压后 manifest.json 文件": { vi: "Hỗ trợ: Tệp nén .zip hoặc tệp manifest.json trong thư mục đã giải nén", en: "Supported: .zip archive or extracted manifest.json file" },
  "选择文件": { vi: "Chọn tệp cài đặt...", en: "Select File..." },
  "插件加载器": { vi: "Bộ nạp tiện ích (Plugin Loader)", en: "Plugin Loader" },
  "插件列表查看·安装·更新": { vi: "Duyệt danh sách, cài đặt & cập nhật các tiện ích mở rộng", en: "Browse, install & update plugins" },
  "版本：": { vi: "Phiên bản: ", en: "Version: " },
  "作者：": { vi: "Tác giả: ", en: "Author: " },
  "仓库：": { vi: "Mã nguồn: ", en: "Repo: " },
  "管理": { vi: "Quản lý", en: "Manage" },
  "启用插件": { vi: "Bật tiện ích này", en: "Enable Plugin" },
  "删除插件数据": { vi: "Xóa dữ liệu cài đặt của tiện ích", en: "Clear Plugin Data" },
  "删除插件本体": { vi: "Gỡ cài đặt tiện ích này", en: "Uninstall Plugin" },
  "暂无仓库信息": { vi: "Chưa có liên kết mã nguồn", en: "No repository link" },
  "本体目录位置": { vi: "Thư mục cài đặt gốc của LiteLoaderQQNT", en: "Core Installation Directory" },
  "LiteLoaderQQNT 本体的安装位置，可以安装到任意位置": { vi: "Vị trí lưu các tệp hệ thống của bộ nạp LiteLoaderQQNT", en: "Directory where LiteLoaderQQNT core files are stored" },
  "数据目录位置": { vi: "Thư mục chứa Plugin & Dữ liệu người dùng", en: "Plugins & Data Directory" },
  "可通过 LITELOADERQQNT_PROFILE 环境变量指定数据存放位置": { vi: "Có thể tùy chỉnh vị trí thư mục này qua biến môi trường LITELOADERQQNT_PROFILE", en: "Can be customized via the LITELOADERQQNT_PROFILE environment variable" },
  "LiteLoaderQQNT 是 QQNT 的插件加载器，一般在 QQNT 的环境内简称为 LiteLoader。": { vi: "LiteLoaderQQNT là bộ nạp tiện ích mở rộng dành cho QQNT (thường gọi tắt là LiteLoader).", en: "LiteLoaderQQNT is the open-source plugin loader for QQNT." },
  "它可以让你自由地为 QQNT 添加各种插件，实现美化主题、增加功能等各种功能。": { vi: "Giúp bạn tự do cài đặt thêm gói ngôn ngữ, giao diện đẹp mắt và các tính năng nâng cao cho QQ.", en: "Allows you to freely add language packs, custom themes, and extra features to QQNT." },
  "开源协议": { vi: "Giấy phép mã nguồn mở", en: "Open Source License" },
  "LiteLoaderQQNT 官网": { vi: "Trang chủ LiteLoaderQQNT", en: "Official Website" },
  "GitHub 仓库": { vi: "Kho mã nguồn GitHub", en: "GitHub Repository" },
  "Telegram 群组": { vi: "Nhóm thảo luận Telegram", en: "Telegram Group" },
  "Telegram 频道": { vi: "Kênh thông báo Telegram", en: "Telegram Channel" },
  "春空千鹤若幻梦，夕波千鸟若长鸣。": { vi: "Hạc bay trời xuân tựa mộng ảo, chim chiều vỗ sóng vọng ngân dài.", en: "A thousand cranes in the spring sky like a dream..." },
  "过滤下方插件，支持插件名、描述、作者名、版本号": { vi: "Nhập tên tiện ích, tính năng hoặc tên tác giả để lọc nhanh...", en: "Filter plugins by name, description, author, or version..." },
  "根据类型过滤": { vi: "Lọc theo phân loại", en: "Filter by Category" },
  "扩展": { vi: "Tính năng", en: "Extensions" },
  "主题": { vi: "Giao diện", en: "Themes" },
  "框架": { vi: "Thư viện nền", en: "Frameworks" },
  "插件版本：": { vi: "Phiên bản: ", en: "Plugin Version: " },
  "插件总数：": { vi: "Tổng số tiện ích trên chợ: ", en: "Total Available Plugins: " },
  "列表仓库": { vi: "Nguồn tải danh sách Chợ Plugin", en: "Plugin Registry Source" },
  "刷新会禁用缓存并请求，所以会比较慢，可用来检查更新，建议不要频繁刷新": { vi: "Bấm làm mới sẽ tải lại danh sách trực tiếp từ GitHub để kiểm tra bản cập nhật mới", en: "Refreshing bypasses cache to fetch the latest list from GitHub" },
  "列表排序": { vi: "Thứ tự sắp xếp danh sách", en: "Sort Order" },
  "选择先后会影响排序": { vi: "Thứ tự bạn chọn sẽ quyết định tiêu chí ưu tiên sắp xếp", en: "Selection order determines sorting priority" },
  "默认排序": { vi: "Sắp xếp mặc định", en: "Default Order" },
  "需要更新": { vi: "Có bản cập nhật mới", en: "Update Available" },
  "接口超时时间": { vi: "Thời gian chờ kết nối mạng tối đa", en: "Network Timeout" },
  "控制所有请求，不包括图片，最少为3000": { vi: "Giới hạn thời gian chờ khi tải danh sách tiện ích (tối thiểu 3000 ms)", en: "Timeout for API requests excluding images (min 3000ms)" },
  "超时时间（ms）": { vi: "Thời gian chờ (ms)", en: "Timeout (ms)" },
  "是否使用镜像": { vi: "Sử dụng máy chủ tăng tốc (Mirror)", en: "Use Mirror Server" },
  "使用代理时建议关闭": { vi: "Khuyên tắt nếu mạng quốc tế của bạn ổn định hoặc đang bật VPN/Proxy", en: "Recommended to disable when using direct internet or VPN/Proxy" },
  "修改镜像": { vi: "Tùy chỉnh máy chủ Mirror", en: "Configure Mirrors" },
  "是否使用github.io": { vi: "Tải danh sách qua tên miền github.io", en: "Use github.io Domain" },
  "由": { vi: "Được ", en: "Maintained by " },
  "Github Action定时任务": { vi: "GitHub Actions", en: "GitHub Actions" },
  "自动更新的列表数据源，每两小时更新一次，使用github.io域名访问，可能会加快访问速度": { vi: " tự động đồng bộ mỗi 2 giờ qua tên miền github.io giúp tải danh sách nhanh hơn", en: " synced every 2 hours via github.io for faster access" },
  "是否使用代理": { vi: "Sử dụng máy chủ Proxy khi tải Plugin", en: "Use Proxy for Downloads" },
  "如果启用且未设置地址会自动获取环境代理，Windows 设置系统代理无效，对页面图片无效": { vi: "Nếu bật mà để trống địa chỉ sẽ tự lấy Proxy từ biến môi trường hệ thống", en: "Automatically reads environment proxy if address is left blank" },
  "设置代理": { vi: "Cài đặt địa chỉ Proxy", en: "Proxy Settings" },
  "设置GitHub令牌": { vi: "Mã truy cập GitHub (Personal Access Token)", en: "GitHub Access Token" },
  "遇到请求速率限制时可以填写令牌缓解此问题": { vi: "Điền mã Token của GitHub nếu gặp lỗi giới hạn số lượt tải API", en: "Enter a GitHub token to avoid API rate limits" },
  "选择包来源": { vi: "Nguồn gói cài đặt tiện ích", en: "Plugin Package Source" },
  "注意： 安装/更新 时会删除插件原文件（不包括配置），如果有修改过的文件，请先备份或者使用 git 进行安装/更新 一般插件都会使用": { vi: "Lưu ý: Khi cài đặt/cập nhật sẽ ghi đè thư mục mã nguồn của tiện ích (dữ liệu cài đặt vẫn được giữ nguyên). Đa số tiện ích dùng gói ", en: "Note: Installing/updating replaces plugin code files (settings are preserved). Most plugins use " },
  "包进行更新，除非有特殊说明，如果不确定可以点击详情前往插件仓库进行查看": { vi: " để cập nhật ổn định nhất, trừ khi tác giả có hướng dẫn riêng", en: " packages unless stated otherwise in the plugin repo" },
  "使用仓库代码包": { vi: "Tải trực tiếp từ nhánh mã nguồn (Branch)", en: "Branch Source Archive" },
  "使用release包": { vi: "Tải bản phát hành chính thức (Release)", en: "Official Release Package" },
  "插件": { vi: "Tiện ích (Plugins)", en: "Plugins" },
  "扩展插件": { vi: "Tiện ích tính năng", en: "Extensions" },
  "主题插件": { vi: "Giao diện (Themes)", en: "Themes" },
  "依赖插件": { vi: "Thư viện nền tảng", en: "Dependencies" },
  "已安装": { vi: "Đã cài", en: "Installed" },
  "未安装": { vi: "Chưa cài", en: "Available" },
  "安装": { vi: "Cài đặt", en: "Install" },
  "卸载": { vi: "Gỡ bỏ", en: "Uninstall" },
  "更新": { vi: "Nâng cấp", en: "Update" },
  "重载": { vi: "Nạp lại", en: "Reload" },
  "启用": { vi: "Đang bật", en: "Enabled" },
  "禁用": { vi: "Đang tắt", en: "Disabled" },
  "版本": { vi: "Phiên bản", en: "Version" },
  "作者": { vi: "Tác giả", en: "Author" },
  "打开插件目录": { vi: "Mở thư mục chứa Plugin", en: "Open Plugins Folder" },
  "打开数据目录": { vi: "Mở thư mục lưu cấu hình", en: "Open Data Folder" },
  "刷新列表": { vi: "Tải lại danh sách", en: "Refresh List" },

  // =========================================================================
  // 12. KHUNG CHAT, NHÓM & HỒ SƠ CÁ NHÂN (CHAT, GROUPS & PROFILE)
  // =========================================================================
  "在线": { vi: "Đang hoạt động", en: "Online" },
  "Q我吧": { vi: "Sẵn sàng trò chuyện", en: "Chat with Me" },
  "离开": { vi: "Tạm vắng", en: "Away" },
  "忙碌": { vi: "Đang bận", en: "Busy" },
  "请勿打扰": { vi: "Không làm phiền", en: "Do Not Disturb" },
  "隐身": { vi: "Ẩn trạng thái truy cập", en: "Invisible" },
  "离线": { vi: "Ngoại tuyến", en: "Offline" },
  "添加状态": { vi: "Đặt trạng thái cảm xúc", en: "Set Status" },
  "我的状态": { vi: "Trạng thái hiện tại", en: "My Status" },
  "发送": { vi: "Gửi", en: "Send" },
  "发送(S)": { vi: "Gửi (S)", en: "Send (S)" },
  "关闭": { vi: "Đóng", en: "Close" },
  "关闭(C)": { vi: "Đóng (C)", en: "Close (C)" },
  "表情": { vi: "Nhãn dán & Emoji", en: "Stickers" },
  "截图": { vi: "Chụp màn hình", en: "Screenshot" },
  "文件": { vi: "Gửi tệp tin", en: "Send File" },
  "图片": { vi: "Gửi ảnh / video", en: "Photos & Videos" },
  "视频": { vi: "Video", en: "Video" },
  "语音": { vi: "Tin nhắn thoại", en: "Voice Clip" },
  "语音通话": { vi: "Gọi thoại", en: "Voice Call" },
  "视频通话": { vi: "Gọi video", en: "Video Call" },
  "屏幕共享": { vi: "Chia sẻ màn hình", en: "Share Screen" },
  "远程协助": { vi: "Điều khiển máy tính từ xa", en: "Remote Control" },
  "远程控制对方电脑": { vi: "Điều khiển máy tính của đối phương", en: "Control Friend's PC" },
  "邀请对方远程协助": { vi: "Mời đối phương điều khiển máy mình", en: "Invite Friend to Control My PC" },
  "红包": { vi: "Lì xì may mắn", en: "Red Packet" },
  "抖一抖": { vi: "Rung cửa sổ gọi bạn", en: "Shake Window" },
  "戳一戳": { vi: "Chọc bạn bè", en: "Nudge" },
  "发起群聊": { vi: "Tạo nhóm trò chuyện mới", en: "New Group Chat" },
  "创建群聊": { vi: "Tạo nhóm mới", en: "Create Group" },
  "添加好友/群": { vi: "Tìm kết bạn / Tham gia nhóm", en: "Add Friend or Group" },
  "加好友/群": { vi: "Thêm bạn / Tìm nhóm", en: "Add Friend or Group" },
  "置顶": { vi: "Ghim hội thoại lên đầu", en: "Pin to Top" },
  "取消置顶": { vi: "Bỏ ghim hội thoại", en: "Unpin" },
  "标记未读": { vi: "Đánh dấu là chưa đọc", en: "Mark as Unread" },
  "标记已读": { vi: "Đánh dấu đã đọc hết", en: "Mark as Read" },
  "消息免打扰": { vi: "Tắt thông báo cuộc trò chuyện này", en: "Mute Notifications" },
  "打开消息通知": { vi: "Bật lại thông báo", en: "Unmute Notifications" },
  "删除聊天": { vi: "Xóa cuộc trò chuyện", en: "Delete Conversation" },
  "从聊天列表中移除": { vi: "Ẩn khỏi danh sách trò chuyện", en: "Hide from Chat List" },
  "复制": { vi: "Sao chép", en: "Copy" },
  "粘贴": { vi: "Dán", en: "Paste" },
  "剪切": { vi: "Cắt", en: "Cut" },
  "全选": { vi: "Chọn tất cả", en: "Select All" },
  "转发": { vi: "Chuyển tiếp", en: "Forward" },
  "逐条转发": { vi: "Chuyển tiếp từng tin rời", en: "Forward Separately" },
  "合并转发": { vi: "Gộp chung để chuyển tiếp", en: "Combine & Forward" },
  "撤回": { vi: "Thu hồi tin nhắn", en: "Unsend / Recall" },
  "回复": { vi: "Trả lời tin này", en: "Reply" },
  "引用": { vi: "Trích dẫn", en: "Quote" },
  "多选": { vi: "Chọn nhiều tin nhắn", en: "Select Multiple" },
  "另存为": { vi: "Lưu tệp về máy...", en: "Save As..." },
  "另存为...": { vi: "Lưu tệp về máy...", en: "Save As..." },
  "添加到表情": { vi: "Lưu vào kho nhãn dán", en: "Save to Stickers" },
  "识别图中二维码": { vi: "Quét mã QR trong ảnh này", en: "Scan QR Code in Image" },
  "提取图中文字": { vi: "Quét lấy chữ trong ảnh (OCR)", en: "Extract Text from Image" },
  "翻译": { vi: "Dịch tin nhắn", en: "Translate" },
  "设为群精华": { vi: "Ghim vào Bảng tin nổi bật của nhóm", en: "Add to Group Highlights" },
  "群公告": { vi: "Bảng thông báo nhóm", en: "Group Announcements" },
  "群文件": { vi: "Kho tệp tin nhóm", en: "Group Files" },
  "群相册": { vi: "Album ảnh của nhóm", en: "Group Albums" },
  "群成员": { vi: "Danh sách thành viên", en: "Group Members" },
  "群聊成员": { vi: "Thành viên nhóm", en: "Group Members" },
  "搜索群成员": { vi: "Tìm kiếm thành viên trong nhóm", en: "Search Group Members" },
  "群应用": { vi: "Tiện ích của nhóm", en: "Group Apps" },
  "群作业": { vi: "Bài tập nhóm", en: "Group Assignments" },
  "群精华": { vi: "Tin nổi bật (Tinh hoa)", en: "Group Highlights" },
  "群视频": { vi: "Video nhóm", en: "Group Videos" },
  "群课堂": { vi: "Lớp học trực tuyến", en: "Group Classroom" },
  "邀请入群": { vi: "Mời thêm bạn vào nhóm", en: "Invite Members" },
  "邀请加群": { vi: "Mời bạn bè vào nhóm", en: "Invite to Group" },
  "退出群聊": { vi: "Rời khỏi nhóm này", en: "Leave Group" },
  "解散群聊": { vi: "Giải tán nhóm", en: "Disband Group" },
  "群聊设置": { vi: "Thiết lập nhóm chat", en: "Group Settings" },
  "群昵称": { vi: "Biệt danh của tôi trong nhóm", en: "My Alias in Group" },
  "群名称": { vi: "Tên nhóm chat", en: "Group Name" },
  "群号": { vi: "Mã ID nhóm", en: "Group ID" },
  "群主": { vi: "Trưởng nhóm", en: "Owner" },
  "管理员": { vi: "Quản trị viên", en: "Admin" },
  "全员禁言": { vi: "Tắt quyền nhắn tin toàn nhóm", en: "Mute All Members" },
  "编辑资料": { vi: "Chỉnh sửa thông tin cá nhân", en: "Edit Profile" },
  "发消息": { vi: "Nhắn tin", en: "Message" },
  "音视频": { vi: "Gọi điện", en: "Call" },
  "昵称": { vi: "Tên hiển thị", en: "Nickname" },
  "备注": { vi: "Tên gợi nhớ (Biệt danh riêng)", en: "Remark Name" },
  "修改备注": { vi: "Đặt tên gợi nhớ", en: "Set Remark" },
  "分组": { vi: "Nhóm danh bạ", en: "Contact Group" },
  "个性签名": { vi: "Dòng trạng thái (Tiểu sử)", en: "Bio" },
  "性别": { vi: "Giới tính", en: "Gender" },
  "男": { vi: "Nam", en: "Male" },
  "女": { vi: "Nữ", en: "Female" },
  "生日": { vi: "Ngày sinh", en: "Birthday" },
  "年龄": { vi: "Tuổi", en: "Age" },
  "所在地": { vi: "Nơi sống", en: "Location" },
  "故乡": { vi: "Quê quán", en: "Hometown" },
  "学校": { vi: "Trường học", en: "School" },
  "公司": { vi: "Nơi làm việc", en: "Company" },
  "职业": { vi: "Nghề nghiệp", en: "Occupation" },
  "邮箱": { vi: "Địa chỉ Email", en: "Email" },
  "删除好友": { vi: "Hủy kết bạn", en: "Unfriend" },
  "加入黑名单": { vi: "Chặn người này", en: "Block User" },
  "举报": { vi: "Báo cáo xấu", en: "Report" },
  "特别关心": { vi: "Bạn bè thân thiết (Đặc biệt)", en: "Close Friends" },
  "我的好友": { vi: "Bạn bè của tôi", en: "My Friends" },
  "家人": { vi: "Gia đình", en: "Family" },
  "同学": { vi: "Bạn học", en: "Classmates" },
  "同事": { vi: "Đồng nghiệp", en: "Colleagues" },
  "确定": { vi: "Đồng ý", en: "OK" },
  "取消": { vi: "Hủy bỏ", en: "Cancel" },
  "保存": { vi: "Lưu lại", en: "Save" },
  "应用": { vi: "Áp dụng", en: "Apply" },
  "完成": { vi: "Hoàn tất", en: "Done" },
  "下一步": { vi: "Tiếp tục", en: "Next" },
  "返回": { vi: "Quay lại", en: "Back" },
  "重试": { vi: "Thử lại", en: "Retry" },
  "刷新": { vi: "Làm mới", en: "Refresh" },
  "删除": { vi: "Xóa", en: "Delete" },
  "同意": { vi: "Chấp nhận", en: "Accept" },
  "拒绝": { vi: "Từ chối", en: "Decline" },
  "已同意": { vi: "Đã kết bạn", en: "Accepted" },
  "已拒绝": { vi: "Đã từ chối", en: "Declined" },
  "等待验证": { vi: "Chờ đối phương đồng ý", en: "Pending" },
  "全部": { vi: "Tất cả", en: "All" },
  "未读": { vi: "Chưa đọc", en: "Unread" },
  "今天": { vi: "Hôm nay", en: "Today" },
  "昨天": { vi: "Hôm qua", en: "Yesterday" },
  "刚刚": { vi: "Vừa xong", en: "Just now" },
  "退出QQ": { vi: "Thoát hoàn toàn QQ", en: "Exit QQ" }
};

var PLACEHOLDER_DICT = {
  "搜索": { vi: "Tìm kiếm bạn bè, nhóm chat, tin nhắn...", en: "Search contacts, groups, messages..." },
  "搜索群成员": { vi: "Tìm thành viên trong nhóm...", en: "Search group members..." },
  "输入消息...": { vi: "Nhập tin nhắn...", en: "Type a message..." },
  "请输入密码": { vi: "Nhập mật khẩu...", en: "Enter password..." },
  "请输入答案": { vi: "Nhập câu trả lời...", en: "Enter answer..." },
  "请输入问题": { vi: "Nhập câu hỏi...", en: "Enter question..." },
  "过滤下方插件，支持插件名、描述、作者名、版本号": {
    vi: "Tìm kiếm tiện ích theo tên, mô tả, tác giả...",
    en: "Filter plugins by name, description, author..."
  }
};

// Mẫu câu động (Regex) tự động dịch các cụm từ kèm tên riêng, giờ giấc, số đếm
var REGEX_PATTERNS = [
  {
    regex: /^已选中\s*(.+)$/,
    vi: (m) => {
      const sub = m[1].trim();
      const translatedSub = (I18N_DICT[sub] && I18N_DICT[sub].vi) ? I18N_DICT[sub].vi : sub;
      return `Đang chọn: ${translatedSub}`;
    },
    en: (m) => {
      const sub = m[1].trim();
      const translatedSub = (I18N_DICT[sub] && I18N_DICT[sub].en) ? I18N_DICT[sub].en : sub;
      return `Selected: ${translatedSub}`;
    }
  },
  {
    regex: /^迷你窗\s+(.+)$/,
    vi: (m) => `Cửa sổ thu gọn (${m[1]})`,
    en: (m) => `Mini Window (${m[1]})`
  },
  {
    regex: /^(\d+)\s*封未读邮件$/,
    vi: (m) => `${m[1]} thư chưa đọc (QQ Mail)`,
    en: (m) => `${m[1]} unread emails (QQ Mail)`
  },
  {
    regex: /^在线状态\s+(.+)$/,
    vi: (m) => {
      const st = m[1].trim();
      const tst = (I18N_DICT[st] && I18N_DICT[st].vi) ? I18N_DICT[st].vi : st;
      return `Trạng thái: ${tst}`;
    },
    en: (m) => {
      const st = m[1].trim();
      const tst = (I18N_DICT[st] && I18N_DICT[st].en) ? I18N_DICT[st].en : st;
      return `Status: ${tst}`;
    }
  },
  {
    regex: /^(.+)\s+(在线|离线|忙碌|离开|请勿打扰|隐身|Q我吧)$/,
    vi: (m) => {
      const st = m[2].trim();
      const tst = (I18N_DICT[st] && I18N_DICT[st].vi) ? I18N_DICT[st].vi : st;
      return `${m[1]} (${tst})`;
    },
    en: (m) => {
      const st = m[2].trim();
      const tst = (I18N_DICT[st] && I18N_DICT[st].en) ? I18N_DICT[st].en : st;
      return `${m[1]} (${tst})`;
    }
  },
  {
    regex: /^(星期[一二三四五六日天])\s*(\d{1,2}:\d{2})$/,
    vi: (m) => {
      const d = (I18N_DICT[m[1]] && I18N_DICT[m[1]].vi) ? I18N_DICT[m[1]].vi : m[1];
      return `${d} ${m[2]}`;
    },
    en: (m) => {
      const d = (I18N_DICT[m[1]] && I18N_DICT[m[1]].en) ? I18N_DICT[m[1]].en : m[1];
      return `${d} ${m[2]}`;
    }
  },
  {
    regex: /^群聊?成员\s*\(?(\d+)\)?$/,
    vi: (m) => `Thành viên nhóm (${m[1]})`,
    en: (m) => `Group Members (${m[1]})`
  },
  {
    regex: /^群聊?成员\s*\(?(\d+)\/(\d+)\)?$/,
    vi: (m) => `Thành viên nhóm (${m[1]}/${m[2]})`,
    en: (m) => `Group Members (${m[1]}/${m[2]})`
  },
  {
    regex: /^顶部\s*(.+?)\s*条未读$/,
    vi: (m) => {
      const count = m[1].includes("object") ? "" : `${m[1]} `;
      return `Phía trên có ${count}tin chưa đọc`;
    },
    en: (m) => {
      const count = m[1].includes("object") ? "" : `${m[1]} `;
      return `${count}unread messages above`;
    }
  },
  {
    regex: /^(.+)的头像$/,
    vi: (m) => `Ảnh đại diện của ${m[1]}`,
    en: (m) => `${m[1]}'s Avatar`
  },
  {
    regex: /^天气[:：](.+)[,，]点击查看详情$/,
    vi: (m) => {
      const w = m[1].trim();
      const tw = (I18N_DICT[w] && I18N_DICT[w].vi) ? I18N_DICT[w].vi : w;
      return `Thời tiết: ${tw} (Bấm xem chi tiết)`;
    },
    en: (m) => {
      const w = m[1].trim();
      const tw = (I18N_DICT[w] && I18N_DICT[w].en) ? I18N_DICT[w].en : w;
      return `Weather: ${tw} (Click for details)`;
    }
  },
  {
    regex: /^昨天\s*(\d{1,2}:\d{2})$/,
    vi: (m) => `Hôm qua ${m[1]}`,
    en: (m) => `Yesterday ${m[1]}`
  },
  {
    regex: /^前天\s*(\d{1,2}:\d{2})$/,
    vi: (m) => `Hôm kia ${m[1]}`,
    en: (m) => `2 days ago ${m[1]}`
  },
  {
    regex: /^版本[:：]\s*(.+?)\s*\((\d+)位\)$/,
    vi: (m) => `Phiên bản: ${m[1]} (${m[2]}-bit)`,
    en: (m) => `Version: ${m[1]} (${m[2]}-bit)`
  },
  {
    regex: /^共\s*(\d+)\s*个?(好友|人|成员)$/,
    vi: (m) => `Tổng cộng ${m[1]} người`,
    en: (m) => `${m[1]} members in total`
  },
  {
    regex: /^共\s*(\d+)\s*个?(群|群聊)$/,
    vi: (m) => `Tổng cộng ${m[1]} nhóm`,
    en: (m) => `${m[1]} groups in total`
  },
  {
    regex: /^共\s*(\d+)\s*个?(会话|文件|项|插件|条)$/,
    vi: (m) => `Tổng cộng ${m[1]} mục`,
    en: (m) => `Total ${m[1]} items`
  },
  {
    regex: /^已选\s*(\d+)\s*项?$/,
    vi: (m) => `Đã chọn ${m[1]} mục`,
    en: (m) => `${m[1]} selected`
  },
  {
    regex: /^(\d+)月(\d+)日$/,
    vi: (m) => `Ngày ${m[2]}/${m[1]}`,
    en: (m) => `${m[1]}/${m[2]}`
  },
  {
    regex: /^(\d+)年(\d+)月(\d+)日$/,
    vi: (m) => `Ngày ${m[3]}/${m[2]}/${m[1]}`,
    en: (m) => `${m[1]}-${m[2]}-${m[3]}`
  },
  {
    regex: /^当前版本[:：]?\s*(.+)$/,
    vi: (m) => `Phiên bản hiện tại: ${m[1]}`,
    en: (m) => `Current Version: ${m[1]}`
  },
  {
    regex: /^(.+)加入了群聊。?$/,
    vi: (m) => `${m[1]} đã tham gia nhóm chat.`,
    en: (m) => `${m[1]} joined the group chat.`
  },
  {
    regex: /^(.+)撤回了一条消息$/,
    vi: (m) => `${m[1]} vừa thu hồi một tin nhắn`,
    en: (m) => `${m[1]} recalled a message`
  },
  {
    regex: /^你撤回了一条消息$/,
    vi: () => `Bạn vừa thu hồi một tin nhắn`,
    en: () => `You recalled a message`
  },
  {
    regex: /^消息\s*(\d+)\s*条未读$/,
    vi: (m) => `Tin nhắn (${m[1]} chưa đọc)`,
    en: (m) => `Messages (${m[1]} unread)`
  },
  {
    regex: /^(\d+)\s*条未读$/,
    vi: (m) => `${m[1]} tin chưa đọc`,
    en: (m) => `${m[1]} unread`
  },
  {
    regex: /^【图片】(.*)$/,
    vi: (m) => `[Hình ảnh] ${m[1]}`.trim(),
    en: (m) => `[Photo] ${m[1]}`.trim()
  },
  {
    regex: /^【文件】(.*)$/,
    vi: (m) => `[Tệp tin] ${m[1]}`.trim(),
    en: (m) => `[File] ${m[1]}`.trim()
  },
  {
    regex: /^(\d+)条新消息$/,
    vi: (m) => `${m[1]} tin nhắn mới`,
    en: (m) => `${m[1]} new messages`
  },
  {
    regex: /^\[图片\]$/,
    vi: () => `[Hình ảnh]`,
    en: () => `[Photo]`
  },
  {
    regex: /^\[表情\]$/,
    vi: () => `[Nhãn dán]`,
    en: () => `[Sticker]`
  },
  {
    regex: /^\[动画表情\]$/,
    vi: () => `[Nhãn dán động]`,
    en: () => `[Animated Sticker]`
  },
  {
    regex: /^\[语音\]$/,
    vi: () => `[Tin nhắn thoại]`,
    en: () => `[Voice]`
  },
  {
    regex: /^\[视频\]$/,
    vi: () => `[Video]`,
    en: () => `[Video]`
  },
  {
    regex: /^\[文件\]\s*(.*)$/,
    vi: (m) => `[Tệp tin] ${m[1]}`,
    en: (m) => `[File] ${m[1]}`
  },
  {
    regex: /^\[QQ红包\]\s*(.*)$/,
    vi: (m) => `[Lì xì QQ] ${m[1]}`,
    en: (m) => `[Red Packet] ${m[1]}`
  },
  {
    regex: /^\[有人@我\]$/,
    vi: () => `[Có người nhắc đến bạn]`,
    en: () => `[Mentioned you]`
  },
  {
    regex: /^\[草稿\]$/,
    vi: () => `[Bản nháp]`,
    en: () => `[Draft]`
  }
];


var HAS_CHINESE_RE = /[\u4e00-\u9fa5]/;
var PURE_CHINESE_PHRASE_RE = /[\u4e00-\u9fa5]{2,}/g;

// Tạo danh sách khóa từ điển sắp xếp từ dài nhất đến ngắn nhất để dịch cụm từ con (Substring Replacement)
var SORTED_DICT_KEYS = Object.keys(I18N_DICT)
  .filter((k) => k.length >= 2 && HAS_CHINESE_RE.test(k))
  .sort((a, b) => b.length - a.length);

function getTranslationEntry(raw) {
  if (I18N_DICT[raw] && I18N_DICT[raw][currentLang]) {
    return I18N_DICT[raw][currentLang];
  }
  if (customDict[currentLang] && customDict[currentLang][raw]) {
    return customDict[currentLang][raw];
  }
  return null;
}

function isAlreadyTranslatedInDict(raw) {
  if (!raw) return true;
  if (I18N_DICT[raw] || PLACEHOLDER_DICT[raw]) return true;
  if (customDict[currentLang] && customDict[currentLang][raw]) return true;
  for (var i = 0; i < REGEX_PATTERNS.length; i++) {
    if (REGEX_PATTERNS[i].regex.test(raw)) return true;
  }
  return false;
}

// Đọc và gộp danh sách từ chưa dịch từ localStorage (Chống ghi đè giữa Cửa sổ Chính và Cửa sổ Cài đặt)
function getMasterUntranslatedList() {
  try {
    var arr = JSON.parse(localStorage.getItem(STORAGE_KEY_UNTRANSLATED) || "[]");
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => item && !isAlreadyTranslatedInDict(item) && !item.includes("简体中文"));
  } catch (e) {
    return [];
  }
}

var localUntranslatedCache = new Set(getMasterUntranslatedList());

function isUserGeneratedContent(node, raw) {
  if (!raw || raw.endsWith("：") || raw.includes("<$") || raw.includes("简体中文")) return true;
  if (!node) return false;
  var el = node.parentElement || node;
  while (el && el !== document.body) {
    var cls = (el.className && typeof el.className === "string") ? el.className : "";
    if (
      cls.includes("message-content") ||
      cls.includes("msg-content") ||
      cls.includes("chat-input") ||
      cls.includes("recent-contact") ||
      cls.includes("contact-item") ||
      cls.includes("group-member") ||
      cls.includes("member-name") ||
      cls.includes("user-name") ||
      cls.includes("nick") ||
      cls.includes("summary") ||
      el.isContentEditable
    ) {
      return true;
    }
    el = el.parentElement || (el.getRootNode && el.getRootNode().host);
  }
  return false;
}

var syncDebounceTimer = null;
function recordUntranslated(raw, node) {
  if (!raw || raw.length > 80 || localUntranslatedCache.has(raw)) return;
  if (isAlreadyTranslatedInDict(raw)) return;
  if (node && isUserGeneratedContent(node, raw)) return;

  localUntranslatedCache.add(raw);
  if (!syncDebounceTimer) {
    syncDebounceTimer = setTimeout(() => {
      syncDebounceTimer = null;
      try {
        // Luôn đọc danh sách mới nhất từ tất cả các cửa sổ rồi gộp chung!
        var existing = getMasterUntranslatedList();
        var merged = new Set([...existing, ...Array.from(localUntranslatedCache)]);
        var cleanList = Array.from(merged)
          .filter((item) => !isAlreadyTranslatedInDict(item))
          .slice(-800);
        localStorage.setItem(STORAGE_KEY_UNTRANSLATED, JSON.stringify(cleanList));
      } catch (e) {}
    }, 200);
  }
}

// Dịch một chuỗi văn bản bất kỳ (Khớp chính xác -> Regex -> Tách cụm từ con)
function translateStringValue(raw, nodeForLog) {
  if (!raw || currentLang === "zh" || !HAS_CHINESE_RE.test(raw)) return null;

  // 1. Khớp chính xác 100% trong từ điển thủ công hoặc từ điển mở rộng
  var exact = getTranslationEntry(raw);
  if (exact) return exact;

  // 2. Khớp mẫu câu động (Regex)
  for (var i = 0; i < REGEX_PATTERNS.length; i++) {
    var pattern = REGEX_PATTERNS[i];
    var match = raw.match(pattern.regex);
    if (match) {
      return pattern[currentLang](match);
    }
  }

  // 3. Thay thế theo cụm từ con (Substring Replacement) nếu chuỗi kết hợp cả số/ký hiệu và chữ Trung
  if (enableSubstringMatch && (!nodeForLog || !isUserGeneratedContent(nodeForLog, raw))) {
    var modified = raw;
    var replacedAny = false;

    // Ưu tiên thay thế các cụm chữ Hán liên tiếp có sẵn trong từ điển
    modified = modified.replace(PURE_CHINESE_PHRASE_RE, (chineseChunk) => {
      var chunkTrans = getTranslationEntry(chineseChunk);
      if (chunkTrans) {
        replacedAny = true;
        return " " + chunkTrans + " ";
      }
      // Nếu cụm chữ Hán dài hơn, thử tách theo từ khóa dài nhất trong I18N_DICT
      var subChunk = chineseChunk;
      for (var k = 0; k < SORTED_DICT_KEYS.length; k++) {
        var key = SORTED_DICT_KEYS[k];
        if (subChunk.includes(key)) {
          var t = getTranslationEntry(key);
          if (t) {
            subChunk = subChunk.split(key).join(" " + t + " ");
            replacedAny = true;
          }
        }
        if (!HAS_CHINESE_RE.test(subChunk)) break;
      }
      return subChunk;
    });

    if (replacedAny) {
      // Nếu sau khi tách cụm từ vẫn còn sót chữ Hán lẻ bên trong thì ghi nhận phần còn sót
      if (HAS_CHINESE_RE.test(modified)) {
        var leftovers = modified.match(PURE_CHINESE_PHRASE_RE);
        if (leftovers) {
          leftovers.forEach((l) => recordUntranslated(l, nodeForLog));
        }
      }
      return modified.replace(/\s{2,}/g, " ").trim();
    }
  }

  // 4. Ghi nhận vào danh sách tổng hợp của mọi cửa sổ
  recordUntranslated(raw, nodeForLog);
  return null;
}

function translateTextNode(node) {
  if (!node || !node.nodeValue || currentLang === "zh") return;
  var raw = node.nodeValue.trim();
  if (!raw || !HAS_CHINESE_RE.test(raw)) return;
  if (isUserGeneratedContent(node, raw)) return;

  var translated = translateStringValue(raw, node);
  if (translated && translated !== raw) {
    node.nodeValue = node.nodeValue.replace(raw, translated);
  }
}

var ATTRS_TO_TRANSLATE = ["placeholder", "title", "aria-label", "alt", "label", "data-title", "data-tooltip"];

function translateElementAttributes(el) {
  if (!el || !el.getAttribute || currentLang === "zh") return;
  for (var i = 0; i < ATTRS_TO_TRANSLATE.length; i++) {
    var attr = ATTRS_TO_TRANSLATE[i];
    var val = el.getAttribute(attr);
    if (val && HAS_CHINESE_RE.test(val)) {
      var clean = val.trim();
      var pEntry = PLACEHOLDER_DICT[clean];
      if (pEntry && pEntry[currentLang]) {
        el.setAttribute(attr, pEntry[currentLang]);
        continue;
      }
      var translated = translateStringValue(clean, el);
      if (translated && translated !== clean) {
        el.setAttribute(attr, translated);
      }
    }
  }
}

// Quét đệ quy xuyên qua cả DOM thường lẫn Shadow DOM (Web Components của QQNT)
var observedRoots = new WeakSet();

function observeRoot(root) {
  if (!root || observedRoots.has(root)) return;
  observedRoots.add(root);
  var observer = new MutationObserver((mutations) => {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (mutation.type === "characterData") {
        translateTextNode(mutation.target);
      } else if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => walkAndTranslate(node));
      } else if (mutation.type === "attributes") {
        translateElementAttributes(mutation.target);
      }
    }
  });
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["placeholder", "title", "aria-label", "label"]
  });
}

function walkAndTranslate(root) {
  if (!root || currentLang === "zh") return;
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root);
    if (root.shadowRoot) {
      observeRoot(root.shadowRoot);
      walkAndTranslate(root.shadowRoot);
    }
  }
  var walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    null
  );
  var current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      translateTextNode(current);
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(current);
      if (current.shadowRoot) {
        observeRoot(current.shadowRoot);
        walkAndTranslate(current.shadowRoot);
      }
    }
    current = walker.nextNode();
  }
}

function initTranslator() {
  if (!document.body) return;
  observeRoot(document.body);
  walkAndTranslate(document.body);
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initTranslator);
} else {
  initTranslator();
}

// === CÔNG CỤ QUÉT SÂU 100% MÃ NGUỒN GIAO DIỆN QQ (DEEP BUNDLE SCANNER) ===
async function deepScanAllQQBundles(statusCallback) {
  walkAndTranslate(document.body);
  var urls = new Set();

  // 1. Lấy tất cả các tệp script đang nạp trong trang
  document.querySelectorAll("script[src]").forEach((s) => {
    if (s.src) urls.add(s.src);
  });

  // 2. Lấy toàn bộ các gói JS (Webpack/Vite chunks) từ Performance Resource Timing API
  if (window.performance && performance.getEntriesByType) {
    performance.getEntriesByType("resource").forEach((r) => {
      if (r.name && (r.name.endsWith(".js") || r.name.includes(".js?"))) {
        urls.add(r.name);
      }
    });
  }

  var urlList = Array.from(urls);
  var extractedCount = 0;
  // Biểu thức chính quy lọc các nhãn giao diện tiếng Trung ngắn gọn (2 - 28 ký tự) nằm trong cặp dấu nháy
  var stringLiteralRe = /["']([\u4e00-\u9fa5][\u4e00-\u9fa5A-Za-z0-9\s，。！？、：；（）()\/·\-_]{0,26}[\u4e00-\u9fa5])["']/g;

  for (var i = 0; i < urlList.length; i++) {
    var u = urlList[i];
    if (u.includes("liteloader") || u.includes("renderer")) continue;
    if (statusCallback) {
      statusCallback(`Đang quét gói mã nguồn QQ (${i + 1}/${urlList.length})...`);
    }
    try {
      var res = await fetch(u);
      if (!res.ok) continue;
      var code = await res.text();
      var match;
      while ((match = stringLiteralRe.exec(code)) !== null) {
        var str = match[1].trim();
        // Lọc bỏ các chuỗi rác hoặc tên hàm kỹ thuật
        if (
          str.length >= 2 &&
          str.length <= 28 &&
          !isAlreadyTranslatedInDict(str) &&
          !localUntranslatedCache.has(str)
        ) {
          localUntranslatedCache.add(str);
          extractedCount++;
        }
      }
    } catch (e) {}
  }

  // Lưu toàn bộ vào danh sách tổng hợp
  var existing = getMasterUntranslatedList();
  var merged = Array.from(new Set([...existing, ...Array.from(localUntranslatedCache)]))
    .filter((item) => !isAlreadyTranslatedInDict(item))
    .slice(0, 1500);
  try {
    localStorage.setItem(STORAGE_KEY_UNTRANSLATED, JSON.stringify(merged));
  } catch (e) {}

  return { totalUntranslated: merged.length, newlyExtracted: extractedCount };
}

// === CÔNG CỤ DỊCH HÀNG LOẠT 1 LẦN & LƯU VĨNH VIỄN VÀO BỘ NHỚ ===
async function batchTranslateAllUntranslated(statusCallback) {
  var list = getMasterUntranslatedList();
  if (list.length === 0) return 0;

  var targetTl = currentLang === "en" ? "en" : "vi";
  var batchSize = 25;
  var translatedTotal = 0;

  for (var i = 0; i < list.length; i += batchSize) {
    var chunk = list.slice(i, i + batchSize);
    if (statusCallback) {
      statusCallback(`Đang chuyển ngữ tự động ${Math.min(i + batchSize, list.length)}/${list.length} cụm từ...`);
    }
    try {
      // Gộp bằng ký tự xuống dòng để dịch 25 câu trong 1 lần gọi duy nhất (nhanh gấp 25 lần)
      var joined = chunk.join("\n");
      var url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=${targetTl}&dt=t&q=${encodeURIComponent(joined)}`;
      var res = await fetch(url);
      if (!res.ok) continue;
      var data = await res.json();
      if (data && Array.isArray(data[0])) {
        var fullTranslated = data[0].map((part) => part[0]).join("");
        var lines = fullTranslated.split("\n");
        for (var j = 0; j < chunk.length; j++) {
          var orig = chunk[j];
          var transLine = (lines[j] || "").trim();
          if (transLine && transLine !== orig) {
            customDict[currentLang][orig] = transLine;
            localUntranslatedCache.delete(orig);
            translatedTotal++;
          }
        }
        saveCustomDict();
      }
    } catch (e) {}
  }

  // Cập nhật lại danh sách chưa dịch và dịch lại toàn bộ giao diện ngay lập tức
  var remaining = getMasterUntranslatedList();
  try {
    localStorage.setItem(STORAGE_KEY_UNTRANSLATED, JSON.stringify(remaining));
  } catch (e) {}
  walkAndTranslate(document.body);
  return translatedTotal;
}

// Giao diện bảng điều khiển trong Cài đặt LiteLoaderQQNT
export const onSettingWindowCreated = (view) => {
  var currentList = getMasterUntranslatedList();
  var customCount = Object.keys(customDict[currentLang] || {}).length;

  var container = document.createElement("div");
  container.style.padding = "20px";
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";
  container.innerHTML = `
    <div style="background: rgba(128,128,128,0.1); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Cấu hình Ngôn ngữ QQNT (LiteLoaderQQNT-i18n v8.0 — Quét Toàn Diện 100%)</h3>
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 6px; font-size: 13px; opacity: 0.85;">
          Ngôn ngữ hiển thị (Interface Language):
        </label>
        <select id="qqnt-i18n-select" style="padding: 8px 12px; border-radius: 6px; font-size: 14px; min-width: 260px; background: rgba(0,0,0,0.2); color: inherit; border: 1px solid rgba(128,128,128,0.3);">
          <option value="vi" ${currentLang === "vi" ? "selected" : ""}>Tiếng Việt (Từ điển thủ công + Quét toàn diện)</option>
          <option value="en" ${currentLang === "en" ? "selected" : ""}>English (Natural UI + Deep Scanner)</option>
          <option value="zh" ${currentLang === "zh" ? "selected" : ""}>简体中文 (Ngôn ngữ gốc)</option>
        </select>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer;">
          <input type="checkbox" id="qqnt-i18n-substring" ${enableSubstringMatch ? "checked" : ""} />
          <span>Tự động tách & dịch cụm từ tiếng Trung nằm bên trong câu phức hợp (Tránh sót chữ khi câu có kèm số đếm/ký hiệu)</span>
        </label>
      </div>

      <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(128,128,128,0.2);">
        <p style="margin: 0 0 10px 0; font-size: 13px; opacity: 0.9;">
          • Số cụm từ chưa dịch thu thập từ <b>tất cả cửa sổ QQ</b>: <b id="qqnt-i18n-count">${currentList.length}</b> mục<br/>
          • Số cụm từ đã dịch bổ sung trong bộ nhớ máy: <b id="qqnt-i18n-custom-count">${customCount}</b> mục
        </p>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button id="qqnt-i18n-deep-scan" style="padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; background: #7c3aed; color: #fff; border: none; font-weight: 500;">
            🔍 1. Quét sâu 100% mã nguồn QQ
          </button>
          <button id="qqnt-i18n-auto-all" style="padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; background: #059669; color: #fff; border: none; font-weight: 500;">
            ⚡ 2. Dịch tự động 100% một lần & Lưu vĩnh viễn
          </button>
          <button id="qqnt-i18n-copy-untranslated" style="padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; background: #2563eb; color: #fff; border: none;">
            📋 Sao chép danh sách (${currentList.length} mục)
          </button>
          <button id="qqnt-i18n-clear-untranslated" style="padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; background: rgba(128,128,128,0.25); color: inherit; border: none;">
            🗑️ Làm mới bộ đếm
          </button>
        </div>
        <div id="qqnt-i18n-status" style="margin-top: 10px; font-size: 13px; color: #10b981; display: none;"></div>
      </div>
    </div>
  `;
  view.appendChild(container);

  var selectEl = container.querySelector("#qqnt-i18n-select");
  var subEl = container.querySelector("#qqnt-i18n-substring");
  var deepScanBtn = container.querySelector("#qqnt-i18n-deep-scan");
  var autoAllBtn = container.querySelector("#qqnt-i18n-auto-all");
  var copyBtn = container.querySelector("#qqnt-i18n-copy-untranslated");
  var clearBtn = container.querySelector("#qqnt-i18n-clear-untranslated");
  var countEl = container.querySelector("#qqnt-i18n-count");
  var customCountEl = container.querySelector("#qqnt-i18n-custom-count");
  var statusEl = container.querySelector("#qqnt-i18n-status");

  function updateCounters(msg) {
    var list = getMasterUntranslatedList();
    var cCount = Object.keys(customDict[currentLang] || {}).length;
    if (countEl) countEl.textContent = String(list.length);
    if (customCountEl) customCountEl.textContent = String(cCount);
    if (copyBtn) copyBtn.textContent = `📋 Sao chép danh sách (${list.length} mục)`;
    if (msg && statusEl) {
      statusEl.textContent = msg;
      statusEl.style.display = "block";
    }
  }

  // Tự động cập nhật số đếm khi cửa sổ khác phát hiện từ mới
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY_UNTRANSLATED) {
      updateCounters();
    }
  });

  if (selectEl) {
    selectEl.addEventListener("change", (e) => {
      currentLang = e.target.value;
      localStorage.setItem(STORAGE_KEY_LANG, currentLang);
      walkAndTranslate(document.body);
      updateCounters("✓ Đã đổi ngôn ngữ hiển thị!");
    });
  }

  if (subEl) {
    subEl.addEventListener("change", (e) => {
      enableSubstringMatch = e.target.checked;
      localStorage.setItem(STORAGE_KEY_SUBSTRING, String(enableSubstringMatch));
      walkAndTranslate(document.body);
      updateCounters("✓ Đã cập nhật chế độ dịch cụm từ con!");
    });
  }

  if (deepScanBtn) {
    deepScanBtn.addEventListener("click", async () => {
      deepScanBtn.disabled = true;
      var res = await deepScanAllQQBundles((progressMsg) => updateCounters(progressMsg));
      deepScanBtn.disabled = false;
      updateCounters(`✓ Quét hoàn tất! Phát hiện tổng cộng ${res.totalUntranslated} cụm từ chưa dịch trong toàn bộ gói giao diện.`);
    });
  }

  if (autoAllBtn) {
    autoAllBtn.addEventListener("click", async () => {
      autoAllBtn.disabled = true;
      var count = await batchTranslateAllUntranslated((progressMsg) => updateCounters(progressMsg));
      autoAllBtn.disabled = false;
      updateCounters(`✓ Đã dịch tự động và lưu vĩnh viễn ${count} cụm từ mới! Toàn bộ giao diện đã được cập nhật.`);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      var list = getMasterUntranslatedList();
      navigator.clipboard.writeText(JSON.stringify(list, null, 2));
      updateCounters(`✓ Đã sao chép ${list.length} cụm từ vào Clipboard! Bạn có thể dán (Ctrl+V) gửi vào khung chat.`);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localUntranslatedCache.clear();
      localStorage.removeItem(STORAGE_KEY_UNTRANSLATED);
      updateCounters("✓ Đã làm mới bộ đếm!");
    });
  }
};