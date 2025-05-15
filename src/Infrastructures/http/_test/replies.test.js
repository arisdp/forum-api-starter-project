const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    let server;
    let accessToken;
    let threadId;
    let commentId;

    beforeAll(async () => {
        server = await createServer(container);

        // Register user
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            },
        });

        // Login user
        const loginResponse = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
                username: 'dicoding',
                password: 'secret',
            },
        });

        ({ data: { accessToken } } = JSON.parse(loginResponse.payload));

        // Create thread
        const threadResponse = await server.inject({
            method: 'POST',
            url: '/threads',
            payload: {
                title: 'sebuah thread',
                body: 'sebuah body thread',
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        ({ data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload));

        // Create comment
        const commentResponse = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: {
                content: 'Sebuah komentar',
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        ({ data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload));
    });

    afterEach(async () => {
        await pool.query('DELETE FROM replies');

        // Restore mocks jika ada
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should respond 201 and persist reply', async () => {
            const replyPayload = { content: 'Sebuah balasan' };

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: replyPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
            expect(responseJson.data.addedReply.content).toEqual(replyPayload.content);
        });

        it('should handle error if postReplyHandler throws an error', async () => {
            // Mock error pada use case
            const postReplyHandler = {
                execute: jest.fn().mockRejectedValue(new Error('Something went wrong')),
            };
            jest.spyOn(container, 'getInstance').mockReturnValue(postReplyHandler);

            const replyPayload = { content: 'Balasan error' };

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: replyPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(500);
            expect(responseJson.status).toEqual('error');
            expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should respond 200 and delete reply', async () => {
            // Buat reply dulu
            const replyPayload = { content: 'Reply untuk dihapus' };

            const replyResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: replyPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const replyResponseJson = JSON.parse(replyResponse.payload);

            const { id: replyId } = replyResponseJson.data.addedReply;

            // Hapus reply
            const deleteResponse = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const deleteResponseJson = JSON.parse(deleteResponse.payload);

            expect(deleteResponse.statusCode).toEqual(200);
            expect(deleteResponseJson.status).toEqual('success');
        });

        it('should handle error if deleteReplyHandler throws an error', async () => {
            // Mock error pada use case
            const deleteReplyHandler = {
                execute: jest.fn().mockRejectedValue(new Error('Something went wrong')),
            };
            jest.spyOn(container, 'getInstance').mockReturnValue(deleteReplyHandler);

            const fakeReplyId = 'reply-123';

            const deleteResponse = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${fakeReplyId}`,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const deleteResponseJson = JSON.parse(deleteResponse.payload);

            expect(deleteResponse.statusCode).toEqual(500);
            expect(deleteResponseJson.status).toEqual('error');
            expect(deleteResponseJson.message).toEqual('terjadi kegagalan pada server kami');
        });
    });
});