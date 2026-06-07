import { Injectable, inject, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../auth/auth.service';

export interface WsNotification {
  type: string;
  message: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private auth = inject(AuthService);
  private client: Client | null = null;

  notifications = signal<WsNotification[]>([]);
  connecte = signal(false);

  connecter() {
    const token = this.auth.token();
    if (!token || this.client?.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        login: token,
        passcode: token,
      },
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        this.connecte.set(true);

        // Spring route automatiquement via le principal JWT
        this.client!.subscribe(
          '/user/queue/notifications',
          (message: IMessage) => {
            const notif: WsNotification = JSON.parse(message.body);
            this.notifications.update((n) => [notif, ...n]);
          },
        );

        this.client!.subscribe('/topic/notifications', (message: IMessage) => {
          const notif: WsNotification = JSON.parse(message.body);
          this.notifications.update((n) => [notif, ...n]);
        });
      },
      onDisconnect: () => {
        this.connecte.set(false);
      },
      onStompError: (frame) => {
        console.warn('STOMP error:', frame);
        this.connecte.set(false);
      },
    });

    this.client.activate();
  }

  deconnecter() {
    this.client?.deactivate();
    this.client = null;
    this.connecte.set(false);
    this.notifications.set([]);
  }

  marquerCommeLu(index: number) {
    this.notifications.update((n) => n.filter((_, i) => i !== index));
  }

  toutEffacer() {
    this.notifications.set([]);
  }
}
