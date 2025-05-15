const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should respond 201 and persisted thread', async () => {
            const requestPayload = {
                title: 'sebuah thread',
                body: 'sebuah body thread',
            };

            const server = await createServer(container);

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

            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            // Add thread
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
        });

        it('should respond 400 when payload not contain needed property', async () => {
            const requestPayload = {
                title: 'sebuah thread',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                },
            });

            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toBeDefined();
        });

        it('should respond 401 when no authentication is provided', async () => {
            const requestPayload = {
                title: 'sebuah thread',
                body: 'sebuah body thread',
            };

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            expect(response.statusCode).toEqual(401);
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should respond 200 and return thread detail', async () => {
            const server = await createServer(container);

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

            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            // Add thread
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

            const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

            // Get thread
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.id).toEqual(threadId);
            expect(responseJson.data.thread.title).toEqual('sebuah thread');
            expect(responseJson.data.thread.body).toEqual('sebuah body thread');
        });

        it('should respond 404 when thread not found', async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toBeDefined();
        });
    });
});