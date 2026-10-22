import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, Check, ShoppingCart, Package, Inbox, 
  AlertTriangle, Info, CheckCheck, ExternalLink, Loader2 
} from "lucide-react";
import { notificationService, type AppNotification } from "../../services/notificationService";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [list, count] = await Promise.all([
        notificationService.getNotifications(false, 30),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener("notification-updated", handleUpdate);
    const interval = setInterval(fetchNotifications, 25000); // Polling every 25s

    return () => {
      window.removeEventListener("notification-updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);

    if (item.link) {
      navigate(item.link);
    } else {
      switch (item.type) {
        case "order":
          navigate("/orders");
          break;
        case "inventory":
          navigate("/inventory");
          break;
        case "request":
          navigate("/requests");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "order":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
        );
      case "inventory":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4" />
          </div>
        );
      case "request":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Inbox className="w-4 h-4" />
          </div>
        );
      case "warning":
      case "alert":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 text-ink flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  const displayedNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notifications-bell-btn"
        data-testid="notifications-bell-btn"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative w-8 h-8 sm:w-9 sm:h-9 border border-[#dce5da] rounded-full grid place-items-center bg-white cursor-pointer hover:bg-[#f8faf9] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        aria-label="Open notifications"
      >
        <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-ink" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 rounded-full bg-brand-orange text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[330px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-line z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-line flex items-center justify-between bg-[#fcfdfa]">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-ink text-sm sm:text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 border-b border-line/60 bg-white flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-brand-green text-white"
                  : "bg-[#f4f7f5] text-[#5b6671] hover:text-ink"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === "unread"
                  ? "bg-brand-green text-white"
                  : "bg-[#f4f7f5] text-[#5b6671] hover:text-ink"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-line/60">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-[#8a949d] flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-brand-green" />
                <span className="text-xs font-medium">Checking notifications...</span>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="p-8 text-center text-[#8a949d] flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#f4f7f5] text-brand-green grid place-items-center">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-ink">You're all caught up!</p>
                <p className="text-xs text-[#5b6671]">No notifications to show right now.</p>
              </div>
            ) : (
              displayedNotifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer transition-colors relative group ${
                    !item.isRead ? "bg-[#f9fbf9] hover:bg-[#eff5ee]" : "hover:bg-[#f8faf9]"
                  }`}
                >
                  {/* Icon */}
                  {getTypeIcon(item.type)}

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-xs sm:text-sm font-black text-ink truncate block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#8a949d] font-bold whitespace-nowrap flex-shrink-0">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[#5b6671] line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-brand-green">
                      <span className="capitalize">{item.type}</span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="flex items-center gap-0.5 group-hover:underline">
                        View Details <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Unread dot / Mark read button */}
                  {!item.isRead && (
                    <div className="absolute right-3 top-4 flex items-center gap-1.5">
                      <span 
                        className="w-2 h-2 rounded-full bg-brand-green shadow-sm" 
                        title="Unread notification"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#fcfdfa] border-t border-line text-center text-xs text-[#8a949d] font-bold">
            Real-time notifications & operations alerts
          </div>
        </div>
      )}
    </div>
  );
}
