const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail', () => {
    it('should create an instance of ThreadDetail when given valid payload', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Test Thread',
            body: 'This is a body of the thread.',
            date: '2025-04-22T10:00:00Z',
            username: 'user-1',
            comments: [],
        };

        // Act
        const threadDetail = new ThreadDetail(payload);

        // Assert
        expect(threadDetail).toBeInstanceOf(ThreadDetail);
        expect(threadDetail.id).toBe(payload.id);
        expect(threadDetail.title).toBe(payload.title);
        expect(threadDetail.body).toBe(payload.body);
        expect(threadDetail.date).toBe(payload.date);
        expect(threadDetail.username).toBe(payload.username);
        expect(threadDetail.comments).toBe(payload.comments);
    });

    it('should throw THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY when missing required properties', () => {
        // Arrange
        const payloadWithoutId = { title: 'Test Thread', body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 'user-1', comments: [] };
        const payloadWithoutTitle = { id: 'thread-123', body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 'user-1', comments: [] };
        const payloadWithoutBody = { id: 'thread-123', title: 'Test Thread', date: '2025-04-22T10:00:00Z', username: 'user-1', comments: [] };
        const payloadWithoutDate = { id: 'thread-123', title: 'Test Thread', body: 'This is a body.', username: 'user-1', comments: [] };
        const payloadWithoutUsername = { id: 'thread-123', title: 'Test Thread', body: 'This is a body.', date: '2025-04-22T10:00:00Z', comments: [] };
        const payloadWithoutComments = { id: 'thread-123', title: 'Test Thread', body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 'user-1' };

        // Act & Assert
        expect(() => new ThreadDetail(payloadWithoutId)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new ThreadDetail(payloadWithoutTitle)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new ThreadDetail(payloadWithoutBody)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new ThreadDetail(payloadWithoutDate)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new ThreadDetail(payloadWithoutUsername)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        expect(() => new ThreadDetail(payloadWithoutComments)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION when properties have incorrect data type', () => {
        // Arrange
        const payloadWithInvalidId = { id: 123, title: 'Test Thread', body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 'user-1', comments: [] };
        const payloadWithInvalidTitle = { id: 'thread-123', title: 123, body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 'user-1', comments: [] };
        const payloadWithInvalidBody = { id: 'thread-123', title: 'Test Thread', body: 123, date: '2025-04-22T10:00:00Z', username: 'user-1', comments: [] };
        const payloadWithInvalidDate = { id: 'thread-123', title: 'Test Thread', body: 'This is a body.', date: 123, username: 'user-1', comments: [] };
        const payloadWithInvalidUsername = { id: 'thread-123', title: 'Test Thread', body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 123, comments: [] };
        const payloadWithInvalidComments = { id: 'thread-123', title: 'Test Thread', body: 'This is a body.', date: '2025-04-22T10:00:00Z', username: 'user-1', comments: 'not an array' };

        // Act & Assert
        expect(() => new ThreadDetail(payloadWithInvalidId)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new ThreadDetail(payloadWithInvalidTitle)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new ThreadDetail(payloadWithInvalidBody)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new ThreadDetail(payloadWithInvalidDate)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new ThreadDetail(payloadWithInvalidUsername)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        expect(() => new ThreadDetail(payloadWithInvalidComments)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
