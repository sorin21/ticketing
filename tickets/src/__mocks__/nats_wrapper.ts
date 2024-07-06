export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, callback: () => void) => {
      // the expectation of this publish is to call this callback right away
      callback();
    },
  },
};
