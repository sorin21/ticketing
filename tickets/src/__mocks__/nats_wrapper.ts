export const natsWrapper = {
  client: {
    // create a muck using jest.fn()
    // publish: (subject: string, data: string, callback: () => void) => {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          // the expectation of this publish is to call this callback right away
          callback();
        }
      ),
  },
};
