import nats, { Stan } from "node-nats-streaming";

// This a Singleton class
// We can then access the client from any other file inside of our project, and we do not have to worry
// about any cyclical dependencies.
class NatsWrapper {
  private _client?: Stan;

  // access the Nats client by using this client property.
  // So that's how we make use of a getter in TypeScript. It's going to define the client property on the instance and
  // use it inside routes/new.ts file
  get client() {
    if (!this._client) {
      throw new Error("Cannon access NATS client before connecting!");
    }
    // If we have already define the client
    return this._client;
  }

  // It has a connect method that we can await that connection on, which is fantastic.
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
