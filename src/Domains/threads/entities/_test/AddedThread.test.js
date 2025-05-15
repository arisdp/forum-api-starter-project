const AddedThread = require('../AddedThread');

describe('AddedThread', () => {
    it('should create an instance of AddedThread when given valid payload', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Test Thread',
            owner: 'user-1',
        };

        // Act
        const addedThread = new AddedThread(payload);

        // Assert
        expect(addedThread).toBeInstanceOf(AddedThread);
        expect(addedThread.id).toBe(payload.id);
        expect(addedThread.title).toBe(payload.title);
        expect(addedThread.owner).toBe(payload.owner);
    });

    it('should throw ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY when missing required properties', () => {
        // Arrange
        const payloadWithoutId = { title: 'Test Thread', owner: 'user-1' };
        const payloadWithoutTitle = { id: 'thread-123', owner: 'user-1' };
        const payloadWithoutOwner = { id: 'thread-123', title: 'Test Thread' };

        // Act & Assert
        expect(() => new AddedThread(payloadWithoutId)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new AddedThread(payloadWithoutTitle)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new AddedThread(payloadWithoutOwner)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION when properties have incorrect data type', () => {
        // Arrange
        const payloadWithInvalidId = { id: 123, title: 'Test Thread', owner: 'user-1' };
        const payloadWithInvalidTitle = { id: 'thread-123', title: 123, owner: 'user-1' };
        const payloadWithInvalidOwner = { id: 'thread-123', title: 'Test Thread', owner: 123 };

        // Act & Assert
        expect(() => new AddedThread(payloadWithInvalidId)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new AddedThread(payloadWithInvalidTitle)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new AddedThread(payloadWithInvalidOwner)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
