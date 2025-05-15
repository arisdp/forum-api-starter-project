const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
    // ✅ ID generator sebagai fungsi
    const fakeIdGenerator = () => '123';

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist new comment and return added comment correctly', async () => {
            // Arrange
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            // await pool.query("INSERT INTO users (id, username, password, fullname) VALUES ('user-123', 'dicoding', 'secret','Dicoding Indonesia')");
            // await pool.query("INSERT INTO threads (id, title, body, owner) VALUES ('thread-123', 'title', 'body', 'user-123')");
            console.log('Tipe fakeIdGenerator:', typeof fakeIdGenerator); // Harus 'function'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            const newComment = {
                content: 'sebuah komentar',
                threadId: 'thread-123',
                owner: 'user-123',
            };

            // Act
            const addedComment = await commentRepositoryPostgres.addComment(newComment);

            // Assert
            expect(addedComment).toHaveProperty('id', 'comment-123');
            expect(addedComment).toHaveProperty('content', 'sebuah komentar');
            expect(addedComment).toHaveProperty('owner', 'user-123');

            const result = await pool.query('SELECT * FROM comments WHERE id = $1', ['comment-123']);
            expect(result.rowCount).toEqual(1);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw NotFoundError when comment does not exist', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xxx', 'user-123'))
                .rejects
                .toThrow(NotFoundError);
        });

        it('should throw AuthorizationError when user is not the owner', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Act & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
                .rejects
                .toThrow(AuthorizationError);
        });

        it('should not throw error when user is the owner', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
                .resolves
                .not.toThrow(AuthorizationError);
        });
    });

    describe('deleteComment function', () => {
        it('should mark comment as deleted', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Act
            await commentRepositoryPostgres.deleteComment('comment-123');

            // Assert
            const result = await pool.query('SELECT is_deleted FROM comments WHERE id = $1', ['comment-123']);
            expect(result.rows[0].is_deleted).toBe(true);
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should return comments based on thread id', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            // await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'sebuah komentar',
                owner: 'user-123',
                threadId: 'thread-123',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Act
            const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

            // Assert
            expect(comments).toHaveLength(1);
            const comment = comments[0];

            // Pastikan hanya properti yang diharapkan
            expect(comment).toMatchObject({
                id: 'comment-123',
                username: 'dicoding',
                content: 'sebuah komentar',
            });
        });
    });

    describe('verifyCommentAvailability function', () => {
        it('should throw NotFoundError if comment not available', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-xxx'))
                .rejects
                .toThrow(NotFoundError);
        });

        it('should not throw error if comment is available', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
                .resolves
                .not.toThrow(NotFoundError);
        });
    });
});
