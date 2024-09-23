import toast from "react-hot-toast";

export const allowedLanguages = [
  "javascript",
  "python",
  "typescript",
  "ruby",
  "java",
  "cpp",
  "go",
  "php",
  "swift",
] as const;

export const infoToast = (toastMessage: string) => {
  toast.error(toastMessage, { icon: "📌" });
};
