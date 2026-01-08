import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

export default createStartHandler({
  createRouter: async () => {
    const { getRouter } = await import("./router");
    return getRouter();
  },
})(defaultStreamHandler);