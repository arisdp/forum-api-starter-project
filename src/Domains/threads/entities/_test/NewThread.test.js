const NewThread = require('../NewThread');

describe('NewThread', () => {
    it('should create an instance of NewThread when given valid payload', () => {
        // Arrange
        const payload = {
            title: 'New Test Thread',
            body: 'This is a body for the new thread.',
            owner: 'user-123',
        };

        // Act
        const newThread = new NewThread(payload);

        // Assert
        expect(newThread).toBeInstanceOf(NewThread);
        expect(newThread.title).toBe(payload.title);
        expect(newThread.body).toBe(payload.body);
        expect(newThread.owner).toBe(payload.owner);
    });

    it('should throw NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when missing required properties', () => {
        // Arrange
        const payloadWithoutTitle = { body: 'This is a body.', owner: 'user-123' };
        const payloadWithoutBody = { title: 'Test Thread', owner: 'user-123' };
        const payloadWithoutOwner = { title: 'Test Thread', body: 'This is a body.' };

        // Act & Assert
        expect(() => new NewThread(payloadWithoutTitle)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new NewThread(payloadWithoutBody)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new NewThread(payloadWithoutOwner)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION when properties have incorrect data type', () => {
        // Arrange
        const payloadWithInvalidTitle = { title: 123, body: 'This is a body.', owner: 'user-123' };
        const payloadWithInvalidBody = { title: 'Test Thread', body: 123, owner: 'user-123' };
        const payloadWithInvalidOwner = { title: 'Test Thread', body: 'This is a body.', owner: 123 };

        // Act & Assert
        expect(() => new NewThread(payloadWithInvalidTitle)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new NewThread(payloadWithInvalidBody)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new NewThread(payloadWithInvalidOwner)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
