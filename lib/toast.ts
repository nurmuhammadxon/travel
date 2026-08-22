import { toast } from "sonner";

export function showSuccess(message: string) {
    toast.success(message, {
        style: {
            backgroundColor: "#16a34a",
            color: "#ffffff",
            border: "1px solid #15803d",
        },
    });
}

export function showError(message: string) {
    toast.error(message, {
        style: {
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "1px solid #b91c1c",
        },
    });
}

export function showInfo(message: string) {
    toast.info(message, {
        style: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
        },
    });
}