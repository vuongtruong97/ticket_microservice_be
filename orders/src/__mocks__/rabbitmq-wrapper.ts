export const rabbitWrapper = {
    connection: {
        createChannel: jest.fn().mockImplementation(() => {
            const channel = {
                assertExchange() {},
                assertQueue() {},
                bindQueue() {},
                publish() {},
            }
            return channel
        }),
    },
}
