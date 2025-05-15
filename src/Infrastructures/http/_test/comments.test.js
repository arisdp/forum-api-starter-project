const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
    let server;
    let accessToken;
    let threadId;

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
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should respond 201 and persist comment', async () => {
            const commentPayload = { content: 'Sebuah komentar' };

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual(commentPayload.content);
        });

        it('should respond 401 when no authentication is provided', async () => {
            const commentPayload = { content: 'Komentar tanpa auth' };

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toBeDefined();
        });

        it('should handle error if AddCommentUseCase throws an error', async () => {
            // Mock AddCommentUseCase to throw an error
            const addCommentUseCase = {
                execute: jest.fn().mockRejectedValue(new Error('Something went wrong')),
            };

            // Replace the original use case with the mocked one
            container.getInstance = jest.fn().mockReturnValue(addCommentUseCase);

            const commentPayload = { content: 'Komentar error' };

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(500); // Error status
            expect(responseJson.status).toEqual('error');
            expect(responseJson.message).toEqual('terjadi kegagalan pada server kami'); // Pesan sesuai implementasi handler
        });
    });
    
    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should respond 200 and delete comment', async () => {
            // Mock deleteCommentUseCase to delete a comment successfully
            const deleteCommentUseCase = {
                execute: jest.fn().mockResolvedValue(true), // Simulating successful deletion
            };

            // Replace the original use case with the mocked one
            container.getInstance = jest.fn().mockReturnValue(deleteCommentUseCase);

            // Create a comment first
            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'komentar untuk dihapus' },
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const responseJson = JSON.parse(addCommentResponse.payload);

            // Tambahkan pemeriksaan struktur respons
            if (!responseJson.data || !responseJson.data.addedComment) {
                console.error('Error: addedComment is missing in the response', responseJson);
                throw new Error('addedComment not found in response');
            }

            const { id: commentId } = responseJson.data.addedComment;

            // Now delete the comment
            const deleteResponse = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const deleteResponseJson = JSON.parse(deleteResponse.payload);
            expect(deleteResponse.statusCode).toEqual(200); // Successful deletion status
            expect(deleteResponseJson.status).toEqual('success');
        });
        const userId = 'user-123';
        it('should handle error if deleteCommentHandler throws an error', async () => {
            // Step 1: Mock AddCommentUseCase dulu buat POST komentar
            const addCommentUseCase = {
                execute: jest.fn().mockResolvedValue({
                    id: 'comment-123',
                    content: 'Komentar untuk error testing',
                    owner: userId,
                }),
            };
            container.getInstance = jest.fn().mockReturnValue(addCommentUseCase);

            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: { content: 'Komentar untuk error testing' },
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const { data: { addedComment: { id: commentId } } } = JSON.parse(addCommentResponse.payload);

            // Step 2: Mock DeleteCommentUseCase supaya THROW error saat DELETE
            const deleteCommentUseCase = {
                execute: jest.fn().mockRejectedValue(new Error('Something went wrong')),
            };
            container.getInstance = jest.fn().mockReturnValue(deleteCommentUseCase);

            // Step 3: Lakukan DELETE dan test error
            const deleteResponse = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const deleteResponseJson = JSON.parse(deleteResponse.payload);

            expect(deleteResponse.statusCode).toEqual(500); // Karena handler akan lempar ke global error handler
            expect(deleteResponseJson.status).toEqual('error');
            expect(deleteResponseJson.message).toEqual('terjadi kegagalan pada server kami'); // sesuai global error handler
        });
    });
});