const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        // Manual binding seperti UsersHandler
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        try {
            // console.log('[HANDLER] postThreadHandler - start');
            const { id: credentialId } = request.auth.credentials;
            const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

            // console.log('[DEBUG] Payload diterima oleh AddThreadUseCase:', addThreadUseCase);

            // console.log('[HANDLER] request.payload:', request.payload);
            // console.log('[HANDLER] request.auth:', request.auth);

            const addedThread = await addThreadUseCase.execute({
                ...request.payload,
                owner: credentialId,
            });

            // console.log('[HANDLER] postThreadHandler - success');

            const response = h.response({
                status: 'success',
                data: {
                    addedThread,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            // console.error('[HANDLER] postThreadHandler - error:', error);
            throw error; // dilempar ke global error handler
        }
    }

    async getThreadByIdHandler(request, h) {
        const { threadId } = request.params;
        const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);

        const thread = await getThreadDetailUseCase.execute(threadId);

        return {
            status: 'success',
            data: {
                thread,
            },
        };
    }
}

module.exports = ThreadsHandler;