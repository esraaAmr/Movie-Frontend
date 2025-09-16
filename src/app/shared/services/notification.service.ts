import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationConfig {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  icon?: string;
  fadeOut?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationConfig[]>([]);
  private notificationId = 0;
  private processingNotifications = new Set<string>();

  getNotifications(): Observable<NotificationConfig[]> {
    return this.notificationsSubject.asObservable();
  }

  showNotification(config: Omit<NotificationConfig, 'id'>): string {
    // Create a unique key for this notification
    const notificationKey = `${config.title}|${config.message}|${config.type}`;
    
    // Check for duplicate notifications with same title and message
    const currentNotifications = this.notificationsSubject.value;
    const isDuplicate = currentNotifications.some(n => 
      n.title === config.title && n.message === config.message && n.type === config.type
    );
    
    // Check if we're already processing this notification
    const isProcessing = this.processingNotifications.has(notificationKey);
    
    if (isDuplicate || isProcessing) {
      return '';
    }

    // Mark as processing
    this.processingNotifications.add(notificationKey);

    const id = `notification-${++this.notificationId}`;
    const notification: NotificationConfig = {
      id,
      duration: 2000, // 2 seconds as requested
      ...config
    };


    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto remove after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.fadeOutNotification(id);
        // Remove after fade animation completes
        setTimeout(() => {
          this.removeNotification(id);
          // Remove from processing set
          this.processingNotifications.delete(notificationKey);
        }, 300); // Match CSS animation duration
      }, notification.duration);
    } else {
      // If no duration, remove from processing set immediately
      this.processingNotifications.delete(notificationKey);
    }

    return id;
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }

  // Method to trigger fade-out animation before removal
  fadeOutNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === id ? { ...notification, fadeOut: true } : notification
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  // Convenience methods
  success(title: string, message: string, duration?: number): string {
    return this.showNotification({
      title,
      message,
      type: 'success',
      icon: 'fas fa-check-circle',
      duration
    });
  }

  error(title: string, message: string, duration?: number): string {
    return this.showNotification({
      title,
      message,
      type: 'error',
      icon: 'fas fa-exclamation-circle',
      duration
    });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.showNotification({
      title,
      message,
      type: 'warning',
      icon: 'fas fa-exclamation-triangle',
      duration
    });
  }

  info(title: string, message: string, duration?: number): string {
    return this.showNotification({
      title,
      message,
      type: 'info',
      icon: 'fas fa-info-circle',
      duration
    });
  }
}
