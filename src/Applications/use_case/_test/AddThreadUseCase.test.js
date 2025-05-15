const AddThreadUseCase = require('../../../Applications/use_case/AddThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

// Import interface jika diperlukan
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
    it('should orchestrate the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'Thread title',
            body: 'Thread body',
            owner: 'user-123',
        };

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        });

        // Jangan gunakan expectedAddedThread untuk mock return
        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn().mockResolvedValue(
            new AddedThread({
                id: 'thread-123',
                title: 'Thread title',
                body: 'Thread body',
                owner: 'user-123',
            })
        );

        // Membuat instance use case dengan dependency yang dimock
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Act
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
        expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        });

        expect(addedThread).toEqual(expectedAddedThread);
    });
});
