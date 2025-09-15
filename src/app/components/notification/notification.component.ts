import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, NotificationConfig } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: NotificationConfig[] = [];
  private subscription: Subscription = new Subscription();
  private fadeOutTimeouts: Map<string, any> = new Map();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // Clear all fade-out timeouts
    this.fadeOutTimeouts.forEach(timeout => clearTimeout(timeout));
    this.fadeOutTimeouts.clear();
  }

  removeNotification(id: string): void {
    // Clear any existing fade-out timeout
    const existingTimeout = this.fadeOutTimeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.fadeOutTimeouts.delete(id);
    }
    
    // Trigger fade-out animation
    this.notificationService.fadeOutNotification(id);
    
    // Remove from service after fade animation completes
    const timeout = setTimeout(() => {
      this.notificationService.removeNotification(id);
      this.fadeOutTimeouts.delete(id);
    }, 300); // Match the CSS animation duration
    
    this.fadeOutTimeouts.set(id, timeout);
  }

  getTypeClass(type: string): string {
    return `notification-${type}`;
  }

  getIconClass(notification: NotificationConfig): string {
    return notification.icon || this.getDefaultIcon(notification.type);
  }

  private getDefaultIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  }

  trackByNotificationId(index: number, notification: NotificationConfig): string {
    return notification.id;
  }
}
