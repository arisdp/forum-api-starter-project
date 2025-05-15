const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
    let threadRepository;

    beforeEach(() => {
        threadRepository = new ThreadRepository();
    });

    it('should throw THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED when addThread is called', async () => {
        // Arrange
        const newThread = { title: 'Test thread', content: 'Test content' };

        // Act & Assert
        await expect(threadRepository.addThread(newThread)).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED when verifyThreadAvailability is called', async () => {
        // Arrange
        const threadId = 'thread-123';

        // Act & Assert
        await expect(threadRepository.verifyThreadAvailability(threadId)).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED when getThreadById is called', async () => {
        // Arrange
        const threadId = 'thread-123';

        // Act & Assert
        await expect(threadRepository.getThreadById(threadId)).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
