import { useToastStore, type ToastType } from "../stores/toastStore";
import { IconCheck, IconAlert, IconClose } from "./icons";

const toastStyles: Record<ToastType, { bg: string; border: string; text: string; icon: "check" | "alert" | "info" }> = {
  success: { bg: "bg-pulse-green/10", border: "border-pulse-green/30", text: "text-pulse-green", icon: "check" },
  error: { bg: "bg-pulse-red/10", border: "border-pulse-red/30", text: "text-pulse-red", icon: "alert" },
  info: { bg: "bg-pulse-amber/10", border: "border-pulse-amber/30", text: "text-pulse-amber", icon: "alert" },
};

const iconMap = {
  check: IconCheck,
  alert: IconAlert,
  info: IconAlert,
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const Icon = iconMap[style.icon];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border ${style.bg} ${style.border} backdrop-blur-md shadow-lg toast-slide-in`}
          >
            <Icon size={18} className={`flex-shrink-0 mt-0.5 ${style.text}`} />
            <p className="text-sm text-text-primary flex-1 min-w-0 leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors p-0.5 -mr-1 -mt-0.5"
              aria-label="Dismiss"
            >
              <IconClose size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
