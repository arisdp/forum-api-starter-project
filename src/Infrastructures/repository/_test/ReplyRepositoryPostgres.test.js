const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres integration', () => {
    const fakeIdGenerator = () => '123'; // reply-123

    let replyRepository;

    beforeAll(async () => {
        replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
    });

    beforeEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();

        // 1. Tambah user
        await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        });

        // 2. Tambah thread
        await ThreadsTableTestHelper.addThread({
            id: 'thread-123',
            title: 'Judul thread',
            body: 'Isi thread',
            owner: 'user-123',
        });

        // 3. Tambah comment
        await CommentsTableTestHelper.addComment({
            id: 'comment-123',
            content: 'Isi komentar',
            threadId: 'thread-123',
            owner: 'user-123',
        });
    });

    afterAll(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addReply and getRepliesByCommentId', () => {
        it('should persist reply and retrieve it by comment id', async () => {
            // add reply
            const newReply = {
                content: 'Balasan Komentar',
                commentId: 'comment-123',
                owner: 'user-123',
            };

            const addedReply = await replyRepository.addReply(newReply);
            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: 'reply-123',
                    content: 'Balasan Komentar',
                    owner: 'user-123',
                })
            );

            // Tidak menggunakan method lain untuk mengecek record di database
            // Memanfaatkan helper untuk memeriksa data
            const replies = await RepliesTableTestHelper.findRepliesByCommentId('comment-123');

            console.log('replies line 82:', replies);
            expect(Array.isArray(replies)).toBe(true);
            expect(replies).toHaveLength(1);
            expect(replies[0]).toEqual(expect.objectContaining({
                id: 'reply-123',
                owner: 'user-123',
                // username: 'dicoding',
                content: 'Balasan Komentar',
                is_deleted: false,
            }));
        });
    });

    describe('verifyReplyOwner', () => {
        it('should throw NotFoundError if reply not found', async () => {
            await expect(replyRepository.verifyReplyOwner('reply-999', 'user-123'))
                .rejects.toThrow(NotFoundError);
        });

        it('should throw AuthorizationError if not the owner', async () => {
            // add reply
            await replyRepository.addReply({
                content: 'reply',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await expect(replyRepository.verifyReplyOwner('reply-123', 'user-999'))
                .rejects.toThrow(AuthorizationError);
        });

        it('should not throw error if owner is correct', async () => {
            await replyRepository.addReply({
                content: 'reply',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await expect(replyRepository.verifyReplyOwner('reply-123', 'user-123'))
                .resolves.not.toThrow(NotFoundError);
        });
    });

    describe('deleteReply', () => {
        it('should mark reply as deleted', async () => {
            await replyRepository.addReply({
                content: 'reply to be deleted',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await replyRepository.deleteReply('reply-123');

            const replies = await RepliesTableTestHelper.findRepliesByCommentId('comment-123');
            expect(replies[0].is_deleted).toBe(true);
        });
    });

    describe('verifyReplyAvailability', () => {
        it('should throw NotFoundError if reply not exist', async () => {
            await expect(replyRepository.verifyReplyAvailability('reply-x'))
                .rejects.toThrow(NotFoundError);
        });

        it('should not throw if reply exists', async () => {
            await replyRepository.addReply({
                content: 'exist',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await expect(replyRepository.verifyReplyAvailability('reply-123'))
                .resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('ReplyRepositoryPostgres - getRepliesByCommentId', () => {
        it('✅ should return replies correctly by commentId', async () => {
            // Arrange
            const newReply = {
                content: 'Balasan Komentar',
                commentId: 'comment-123',
                owner: 'user-123',
            };

            const addedReply = await replyRepository.addReply(newReply);
            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: 'reply-123',
                    content: 'Balasan Komentar',
                    owner: 'user-123',
                })
            );

            // Act
            const replies = await RepliesTableTestHelper.findRepliesByCommentId('comment-123');

            // Assert
            expect(replies).toHaveLength(1);
            expect(replies[0]).toEqual(expect.objectContaining({
                id: 'reply-123',
                owner: 'user-123',
                content: 'Balasan Komentar',
                is_deleted: false,
                comment_id: 'comment-123',
            }));
        });

        it('✅ should return empty array when no replies found', async () => {
            const replies = await RepliesTableTestHelper.findRepliesByCommentId('non-existent-comment');
            expect(replies).toEqual([]);
        });
    });

    describe('ReplyRepositoryPostgres - getRepliesByCommentId', () => {
        it('should return replies correctly by commentId', async () => {
            // Given: Add a reply to the comment with id 'comment-123'
            const newReply = {
                content: 'Balasan pertama',
                commentId: 'comment-123',
                owner: 'user-123',
            };

            await replyRepository.addReply(newReply);

            // When: Retrieve replies for 'comment-123'
            const replies = await replyRepository.getRepliesByCommentId('comment-123');
            console.log('Replies found for comment-123:', replies);  // Debug log

            // Then: Expect to get 1 reply
            expect(replies).toHaveLength(1);
            expect(replies[0]).toEqual(expect.objectContaining({
                id: expect.any(String),  // Match id format (UUID or similar)
                username: expect.any(String),
                content: 'Balasan pertama',
                is_deleted: false, // Assuming not deleted
                comment_id: 'comment-123',
            }));
        });

        it('should return empty array when no replies found', async () => {
            // When: Retrieve replies for a non-existent comment id 'non-existent-comment'
            const replies = await replyRepository.getRepliesByCommentId('non-existent-comment');
            console.log('Replies found for non-existent-comment:', replies);  // Debug log

            // Then: Expect to get an empty array
            expect(replies).toEqual([]);
        });
    });
});
