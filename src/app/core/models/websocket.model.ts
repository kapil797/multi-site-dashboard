import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { HashMap } from '@core/models/abstract.model';
import { Observable } from 'rxjs';

export interface WsMessageStream {
  type: string;
  data: unknown;
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

export function filterStreamFromWebsocketGateway$(wsGateway$: WebSocketSubject<unknown>, stream: string) {
  const stream$ = wsGateway$.multiplex(
    () => ({
      // On subscribing to websocket.
      message: `subscribing to ${stream} stream`,
    }),
    () => ({
      // On destroy.
      message: `unsubscribing from ${stream} stream`,
    }),
    message => {
      // Filter messages.
      // When processing the message, to extend the interface as required.
      const msg = message as WsMessageStream;
      console.log(msg);
      return !!msg.type && msg.type === stream;
    }
  );
  return stream$ as Observable<WsMessageStream>;
}
