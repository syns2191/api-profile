import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { PresenceService } from "../presence/presence.service";

@WebSocketGateway({
  transport: ['websocket'], pingInterval: 10_000, pingTimeout: 20_000, cors: {
    origin: '*',
  },
})
export class OwnerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server
  private ownerSockets = new Set<string>()

  constructor(
    private presenceService: PresenceService
  ) { }

  async handleConnection(socket: Socket) {
    const origEmit = socket.emit;
    socket.emit = function (event: string, ...args: any[]) {
      console.log('[SERVER → CLIENT]', socket.id, event, args);
      return origEmit.apply(this, [event, ...args]);
    };




    console.log('handleConnection')
    const role = (socket.handshake?.query?.role as string) || 'guest';
    if (role !== 'owner') {
      return;
    }
    this.ownerSockets.add(socket.id);
    socket.join('owner');

    await this.presenceService.refresh();
    (socket.conn as any).on('packet', async (packet: { type: string }) => {
      console.log('pacl', packet)
      if (packet.type === 'pong') {
        await this.presenceService.refresh();
        this.io.emit('owner:online'); // optional hint
      }
    });
  }

  async handleDisconnect(socket: Socket) {
    if (!this.ownerSockets.delete(socket.id)) return;
    if (this.ownerSockets.size === 0) {
      this.io.emit('owner:offline');
    }
  }


}
