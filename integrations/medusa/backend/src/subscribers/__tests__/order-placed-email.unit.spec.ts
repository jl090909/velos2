/* eslint-disable */
import orderPlacedHandler from "../order-placed-email";

function makeLogger() {
  return { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
}

function makeContainer(logger: any) {
  return { resolve: (key: string) => (key === "logger" ? logger : undefined) };
}

const ENV_KEYS = [
  "MEDUSA_BACKEND_URL",
  "MEDUSA_PUBLISHABLE_KEY",
  "NEXT_APP_URL",
  "ORDER_CONFIRMATION_WEBHOOK_SECRET",
];

function setEnv(values: Record<string, string | undefined>) {
  for (const k of ENV_KEYS) {
    if (values[k] === undefined) delete process.env[k];
    else process.env[k] = values[k] as string;
  }
}

const BASE_ENV = {
  MEDUSA_BACKEND_URL: "http://medusa.test",
  MEDUSA_PUBLISHABLE_KEY: "pk_test",
  NEXT_APP_URL: "http://next.test",
  ORDER_CONFIRMATION_WEBHOOK_SECRET: "secret_test",
};

describe("orderPlacedHandler", () => {
  const originalEnv = { ...process.env };
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    // @ts-ignore
    global.fetch = fetchMock;
    setEnv(BASE_ENV);
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it("fails closed when required env is missing", async () => {
    setEnv({ ...BASE_ENV, ORDER_CONFIRMATION_WEBHOOK_SECRET: undefined });
    const logger = makeLogger();
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    expect(logger.error).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips when orderId is missing", async () => {
    const logger = makeLogger();
    await orderPlacedHandler({ event: { data: {} }, container: makeContainer(logger) } as any);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("skips orders with non-allowed payment status", async () => {
    const logger = makeLogger();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ order: { id: "order_1", payment_status: "awaiting", status: "pending" } }),
    });
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalled();
  });

  it("skips canceled orders", async () => {
    const logger = makeLogger();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ order: { id: "order_1", payment_status: "captured", status: "canceled" } }),
    });
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalled();
  });

  it("triggers Next route for allowed order", async () => {
    const logger = makeLogger();
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ order: { id: "order_1", payment_status: "captured", status: "completed", email: "a@b.com" } }),
      })
      .mockResolvedValueOnce({ ok: true, text: async () => "" });
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const secondCall = fetchMock.mock.calls[1];
    expect(secondCall[0]).toBe("http://next.test/api/commerce/notifications/order-confirmation");
    expect(secondCall[1].headers["x-velos-internal-secret"]).toBe("secret_test");
    expect(JSON.parse(secondCall[1].body)).toEqual({ orderId: "order_1" });
  });

  it("does not retry on 4xx from Next", async () => {
    const logger = makeLogger();
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ order: { id: "order_1", payment_status: "captured", status: "completed" } }),
      })
      .mockResolvedValueOnce({ ok: false, status: 401, text: async () => "unauthorized" });
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries on 5xx from Next", async () => {
    const logger = makeLogger();
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ order: { id: "order_1", payment_status: "captured", status: "completed" } }),
      })
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "err" })
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "err" })
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "err" });
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    // 1 order fetch + 3 trigger attempts
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("handles network error loading order", async () => {
    const logger = makeLogger();
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    await orderPlacedHandler({ event: { data: { id: "order_1" } }, container: makeContainer(logger) } as any);
    expect(logger.error).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
