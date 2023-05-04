import { Config, Message, RKPlugin, UDPServer } from "@remote-kakao/core";
import type { AddressInfo } from "net";

declare module "@remote-kakao/core" {
	export interface UDPServer {
		rkeval(info: AddressInfo, code: string, timeout?: number): Promise<string>;
	}
	export interface Message {
		rkeval(code: string, timeout?: number): Promise<string>;
	}
}

export class RKEvalPlugin extends RKPlugin {
	constructor(server: UDPServer, config?: Config) {
		super(server, config);
	}

	extendServerClass(server: UDPServer): UDPServer | Promise<UDPServer> {
		server.rkeval = function (
			address: AddressInfo,
			code: string,
			timeout: number = 60000,
		) {
			return server.sendEvent(address, "rkeval", { code }, timeout);
		};

		return server;
	}

	extendMessageClass(message: Message): Message | Promise<Message> {
		message.rkeval = function (
			this: RKEvalPlugin,
			code: string,
			timeout: number = 60000,
		) {
			return this.server.rkeval(message.address, code, timeout);
		}.bind(this);

		return message;
	}
}
