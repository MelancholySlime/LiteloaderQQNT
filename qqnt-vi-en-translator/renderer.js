/**
 * LiteLoaderQQNT UI Translator (Vietnamese / English)
 * Safe DOM Text-Node Replacement — Preserves 100% of Vue/Electron Event Listeners & Functionality
 *
 * HƯỚNG DẪN CÀI ĐẶT (INSTALLATION):
 * 1. Mở thư mục: C:\Users\USER\Documents\LiteloaderQQNT\plugins\
 * 2. Tạo một thư mục mới tên là: qqnt-vi-en-translator
 * 3. Chép tệp này vào trong thư mục đó và đổi tên thành: renderer.js
 * 4. Tạo thêm tệp manifest.json trong cùng thư mục với nội dung:
 *    {
 *      "manifest_version": 4,
 *      "type": "extension",
 *      "name": "QQNT Vietnamese/English Translator",
 *      "slug": "qqnt-vi-en-translator",
 *      "description": "Dịch giao diện QQNT sang Tiếng Việt / Tiếng Anh an toàn",
 *      "version": "1.0.0",
 *      "authors": [{ "name": "Custom Localizer" }],
 *      "platform": ["win32", "linux", "darwin"],
 *      "injects": { "renderer": "./renderer.js" }
 *    }
 */

// Chọn ngôn ngữ hiển thị: "vi" (Tiếng Việt) hoặc "en" (Tiếng Anh)
const TARGET_LANG = "vi";

const DICTIONARY = {
  // Thanh điều hướng chính & Cửa sổ
  "消息": { vi: "Tin nhắn", en: "Messages" },
  "联系人": { vi: "Danh bạ", en: "Contacts" },
  "空间": { vi: "Qzone", en: "Qzone" },
  "设置": { vi: "Cài đặt", en: "Settings" },
  "搜索": { vi: "Tìm kiếm", en: "Search" },
  "好友": { vi: "Bạn bè", en: "Friends" },
  "群聊": { vi: "Nhóm chat", en: "Groups" },
  "频道": { vi: "Kênh", en: "Channels" },
  "设备": { vi: "Thiết bị", en: "Devices" },
  "通讯录": { vi: "Danh bạ", en: "Contacts" },
  "好友通知": { vi: "Lời mời kết bạn", en: "Friend Requests" },
  "群通知": { vi: "Thông báo nhóm", en: "Group Notices" },

  // Trạng thái tài khoản
  "在线": { vi: "Trực tuyến", en: "Online" },
  "Q我吧": { vi: "Chat với tôi", en: "Chat with me" },
  "离开": { vi: "Tạm vắng", en: "Away" },
  "忙碌": { vi: "Đang bận", en: "Busy" },
  "请勿打扰": { vi: "Không làm phiền", en: "Do Not Disturb" },
  "隐身": { vi: "Ẩn danh", en: "Invisible" },
  "离线": { vi: "Ngoại tuyến", en: "Offline" },
  "添加状态": { vi: "Thêm trạng thái", en: "Add Status" },

  // Khung trò chuyện (Chat Window)
  "发送": { vi: "Gửi", en: "Send" },
  "发送(S)": { vi: "Gửi (S)", en: "Send (S)" },
  "关闭(C)": { vi: "Đóng (C)", en: "Close (C)" },
  "表情": { vi: "Biểu cảm", en: "Stickers" },
  "截图": { vi: "Chụp màn hình", en: "Screenshot" },
  "文件": { vi: "Tệp tin", en: "Files" },
  "图片": { vi: "Hình ảnh", en: "Images" },
  "语音通话": { vi: "Gọi thoại", en: "Voice Call" },
  "视频通话": { vi: "Gọi video", en: "Video Call" },
  "屏幕共享": { vi: "Chia sẻ màn hình", en: "Screen Share" },
  "聊天记录": { vi: "Lịch sử chat", en: "Chat History" },
  "远程协助": { vi: "Hỗ trợ từ xa", en: "Remote Assist" },
  "发起群聊": { vi: "Tạo nhóm chat", en: "Create Group" },
  "添加好友/群": { vi: "Thêm bạn / nhóm", en: "Add Friend/Group" },
  "置顶": { vi: "Ghim lên đầu", en: "Pin to Top" },
  "取消置顶": { vi: "Bỏ ghim", en: "Unpin" },
  "标记未读": { vi: "Đánh dấu chưa đọc", en: "Mark as Unread" },
  "标记已读": { vi: "Đánh dấu đã đọc", en: "Mark as Read" },
  "消息免打扰": { vi: "Tắt thông báo", en: "Mute Notifications" },
  "删除聊天": { vi: "Xóa cuộc trò chuyện", en: "Delete Chat" },
  "从聊天列表中移除": { vi: "Ẩn khỏi danh sách chat", en: "Remove from Chat List" },
  "复制": { vi: "Sao chép", en: "Copy" },
  "粘贴": { vi: "Dán", en: "Paste" },
  "转发": { vi: "Chuyển tiếp", en: "Forward" },
  "撤回": { vi: "Thu hồi", en: "Recall" },
  "回复": { vi: "Trả lời", en: "Reply" },
  "引用": { vi: "Trích dẫn", en: "Quote" },
  "多选": { vi: "Chọn nhiều", en: "Multi-select" },
  "收藏": { vi: "Lưu trữ", en: "Favorite" },
  "另存为": { vi: "Lưu thành...", en: "Save As..." },
  "打开文件夹": { vi: "Mở thư mục", en: "Open Folder" },

  // Menu Cài đặt (Settings)
  "通用": { vi: "Cài đặt chung", en: "General" },
  "消息通知": { vi: "Thông báo tin nhắn", en: "Notifications" },
  "存储管理": { vi: "Quản lý dung lượng", en: "Storage" },
  "快捷键": { vi: "Phím tắt", en: "Shortcuts" },
  "超级调色盘": { vi: "Giao diện & Chủ đề", en: "Appearance & Themes" },
  "外观": { vi: "Giao diện", en: "Appearance" },
  "登录设置": { vi: "Cài đặt đăng nhập", en: "Login Settings" },
  "账号与安全": { vi: "Tài khoản & Bảo mật", en: "Account & Security" },
  "隐私": { vi: "Quyền riêng tư", en: "Privacy" },
  "权限设置": { vi: "Cấp quyền", en: "Permissions" },
  "文件管理": { vi: "Quản lý tệp", en: "File Management" },
  "音视频通话": { vi: "Âm thanh & Video", en: "Audio & Video" },
  "关于": { vi: "Giới thiệu", en: "About" },
  "退出登录": { vi: "Đăng xuất", en: "Log Out" },
  "退出QQ": { vi: "Thoát QQ", en: "Exit QQ" },
  "开机自启": { vi: "Khởi động cùng Windows", en: "Launch at Startup" },
  "自动登录": { vi: "Tự động đăng nhập", en: "Auto Login" },
  "检查更新": { vi: "Kiểm tra cập nhật", en: "Check for Updates" },
  "清空缓存": { vi: "Xóa bộ nhớ đệm", en: "Clear Cache" },
  "确定": { vi: "Xác nhận", en: "Confirm" },
  "取消": { vi: "Hủy bỏ", en: "Cancel" },
  "保存": { vi: "Lưu", en: "Save" },
  "编辑资料": { vi: "Sửa hồ sơ", en: "Edit Profile" }
};

const PLACEHOLDER_DICT = {
  "搜索": { vi: "Tìm kiếm...", en: "Search..." },
  "输入消息...": { vi: "Nhập tin nhắn...", en: "Type a message..." }
};

function translateTextNode(node) {
  if (!node || !node.nodeValue) return;
  const raw = node.nodeValue.trim();
  if (!raw) return;
  const entry = DICTIONARY[raw];
  if (entry && entry[TARGET_LANG]) {
    node.nodeValue = node.nodeValue.replace(raw, entry[TARGET_LANG]);
  }
}

function translateElementAttributes(el) {
  if (!el || !el.getAttribute) return;
  const placeholder = el.getAttribute("placeholder");
  if (placeholder) {
    const clean = placeholder.trim();
    const entry = PLACEHOLDER_DICT[clean] || DICTIONARY[clean];
    if (entry && entry[TARGET_LANG]) {
      el.setAttribute("placeholder", entry[TARGET_LANG]);
    }
  }
  const title = el.getAttribute("title");
  if (title) {
    const clean = title.trim();
    const entry = DICTIONARY[clean];
    if (entry && entry[TARGET_LANG]) {
      el.setAttribute("title", entry[TARGET_LANG]);
    }
  }
}

function walkAndTranslate(root) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root);
  }
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    null
  );
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      translateTextNode(current);
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(current);
    }
    current = walker.nextNode();
  }
}

function initTranslator() {
  walkAndTranslate(document.body);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        translateTextNode(mutation.target);
      } else if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => walkAndTranslate(node));
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initTranslator);
} else {
  initTranslator();
}
