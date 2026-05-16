declare module "midtrans-client" {
    export class Snap {
        constructor(config: { isProduction: boolean; serverKey: string });
        createTransaction(params: any): Promise<{ token: string }>;
    }
}
