import { toast } from "sonner";

// Map pour stocker les toasts actifs par clé
const activeToasts = new Map<string, string | number>();

// Durées par défaut
const TOAST_DURATIONS = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  loading: Infinity,
} as const;

interface ToastOptions {
  key?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Affiche un toast de succès sans duplication
 */
export function toastSuccess(message: string, options?: ToastOptions) {
  const key = options?.key || message;
  
  // Fermer le toast précédent s'il existe
  if (activeToasts.has(key)) {
    toast.dismiss(activeToasts.get(key));
  }
  
  const id = toast.success(message, {
    duration: options?.duration || TOAST_DURATIONS.success,
    action: options?.action,
  });
  
  activeToasts.set(key, id);
  
  // Nettoyer après expiration
  setTimeout(() => {
    activeToasts.delete(key);
  }, options?.duration || TOAST_DURATIONS.success);
  
  return id;
}

/**
 * Affiche un toast d'erreur sans duplication
 */
export function toastError(message: string, options?: ToastOptions) {
  const key = options?.key || message;
  
  // Fermer le toast précédent s'il existe
  if (activeToasts.has(key)) {
    toast.dismiss(activeToasts.get(key));
  }
  
  const id = toast.error(message, {
    duration: options?.duration || TOAST_DURATIONS.error,
    action: options?.action,
  });
  
  activeToasts.set(key, id);
  
  // Nettoyer après expiration
  setTimeout(() => {
    activeToasts.delete(key);
  }, options?.duration || TOAST_DURATIONS.error);
  
  return id;
}

/**
 * Affiche un toast d'avertissement sans duplication
 */
export function toastWarning(message: string, options?: ToastOptions) {
  const key = options?.key || message;
  
  // Fermer le toast précédent s'il existe
  if (activeToasts.has(key)) {
    toast.dismiss(activeToasts.get(key));
  }
  
  const id = toast.warning(message, {
    duration: options?.duration || TOAST_DURATIONS.warning,
    action: options?.action,
  });
  
  activeToasts.set(key, id);
  
  // Nettoyer après expiration
  setTimeout(() => {
    activeToasts.delete(key);
  }, options?.duration || TOAST_DURATIONS.warning);
  
  return id;
}

/**
 * Affiche un toast d'information sans duplication
 */
export function toastInfo(message: string, options?: ToastOptions) {
  const key = options?.key || message;
  
  // Fermer le toast précédent s'il existe
  if (activeToasts.has(key)) {
    toast.dismiss(activeToasts.get(key));
  }
  
  const id = toast.info(message, {
    duration: options?.duration || TOAST_DURATIONS.info,
    action: options?.action,
  });
  
  activeToasts.set(key, id);
  
  // Nettoyer après expiration
  setTimeout(() => {
    activeToasts.delete(key);
  }, options?.duration || TOAST_DURATIONS.info);
  
  return id;
}

/**
 * Affiche un toast de chargement sans duplication
 */
export function toastLoading(message: string, key: string) {
  // Fermer le toast précédent s'il existe
  if (activeToasts.has(key)) {
    toast.dismiss(activeToasts.get(key));
  }
  
  const id = toast.loading(message);
  activeToasts.set(key, id);
  
  return id;
}

/**
 * Met à jour un toast existant
 */
export function toastUpdate(key: string, message: string, type: "success" | "error" | "warning" | "info" = "success") {
  const id = activeToasts.get(key);
  if (id) {
    toast.dismiss(id);
    activeToasts.delete(key);
  }
  
  switch (type) {
    case "success":
      return toastSuccess(message, { key });
    case "error":
      return toastError(message, { key });
    case "warning":
      return toastWarning(message, { key });
    case "info":
      return toastInfo(message, { key });
  }
}

/**
 * Ferme un toast spécifique
 */
export function toastDismiss(key: string) {
  const id = activeToasts.get(key);
  if (id) {
    toast.dismiss(id);
    activeToasts.delete(key);
  }
}

/**
 * Ferme tous les toasts actifs
 */
export function toastDismissAll() {
  activeToasts.forEach(id => toast.dismiss(id));
  activeToasts.clear();
}
