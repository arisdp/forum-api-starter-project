const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../../Infrastructures/database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
    const fakeIdGenerator = () => '123'; // stub id generator

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user1' });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread', () => {
        it('should persist new thread and return AddedThread correctly', async () => {
            // Arrange
            const newThread = { title: 'title', body: 'body', owner: 'user-123' };
            const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Act
            const addedThread = await threadRepository.addThread(newThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(threads).toHaveLength(1); // Cek bahwa thread benar-benar ditambahkan

            expect(addedThread).toBeInstanceOf(AddedThread);
            expect(addedThread.id).toEqual('thread-123');
            expect(addedThread.title).toEqual('title');
            expect(addedThread.owner).toEqual('user-123');
        });

        it('should throw error when database fails', async () => {
            // Arrange
            const newThread = { title: 'title', body: 'body', owner: 'user-123' };
            const badPool = {}; // bikin pool error
            const threadRepository = new ThreadRepositoryPostgres(badPool, fakeIdGenerator);

            // Act & Assert
            await expect(threadRepository.addThread(newThread))
                .rejects
                .toThrowError('THREAD_REPOSITORY.FAILED_TO_ADD_THREAD');
        });
    });

    describe('verifyThreadAvailability', () => {
        it('should not throw error when thread exists', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title',
                body: 'body',
                owner: 'user-123',
            });
            const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Act & Assert
            await expect(threadRepository.verifyThreadAvailability('thread-123'))
                .resolves
                .not
                .toThrow(NotFoundError);
        });

        it('should throw NotFoundError when thread not found', async () => {
            const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await expect(threadRepository.verifyThreadAvailability('thread-notfound'))
                .rejects
                .toThrowError(NotFoundError);
        });
    });

    describe('getThreadById', () => {
        it('should return thread detail when found', async () => {
            const date = new Date();
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'thread title',
                body: 'thread body',
                owner: 'user-123',
                date: date.toISOString(),
            });

            const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const thread = await threadRepository.getThreadById('thread-123');

            expect(thread).toEqual(expect.objectContaining({
                id: 'thread-123',
                title: 'thread title',
                body: 'thread body',
                username: 'user1',
            }));
        });

        it('should throw NotFoundError when thread not found', async () => {
            const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await expect(threadRepository.getThreadById('thread-xxx'))
                .rejects
                .toThrowError(NotFoundError);
        });
    });
});
