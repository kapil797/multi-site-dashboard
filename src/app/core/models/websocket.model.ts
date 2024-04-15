import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { HashMap } from '@core/models/abstract.model';
import { Observable } from 'rxjs';

export interface WsMessageStream {
  type: string;
  data: string;
}

export interface WsBroadcastMsg {
  consumer: string;
  message: HashMap;
}

export interface WsFactoryDisplayStream {
  factory: string;
}

export const consumerStreams = {
  RTD: 'rtd',
  FACTORY_DISPLAY: 'factoryDisplay',
};

export function initWebsocketGateway$(url: string) {
  return webSocket({ url });
}

export function filterStreamsFromWebsocketGateway$(wsGateway$: WebSocketSubject<unknown>, streams: string[]) {
  const stream$ = wsGateway$.multiplex(
    () => ({
      // On subscribing to websocket.
      message: `subscribing to websocket`,
    }),
    () => ({
      // On destroy.
      message: `unsubscribing from websocket`,
    }),
    message => {
      if (streams.length === 0) return true;

      // Filter messages.
      // When processing the message, to extend the interface as required.
      const msg = message as WsMessageStream;
      return !!msg.type && streams.includes(msg.type);
    }
  );
  return stream$ as Observable<WsMessageStream>;
}
