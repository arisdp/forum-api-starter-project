const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        // Manual binding
        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        try {
            console.log('[HANDLER] postReplyHandler - start');
            const { id: credentialId } = request.auth.credentials;
            console.log('[HANDLER] postReplyHandler Authenticated user id:', credentialId);
            const { threadId, commentId } = request.params;
            console.log('[HANDLER] postReplyHandler Params received - threadId:', threadId, 'commentId:', commentId);
            const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

            console.log('[HANDLER] postReplyHandler AddReplyUseCase instance created');

            console.log('[HANDLER] postReplyHandler Payload to execute AddReplyUseCase:', {
                ...request.payload,
                threadId,
                commentId,
                owner: credentialId,
            });

            const addedReply = await addReplyUseCase.execute({
                ...request.payload,
                commentId,
                threadId,
                owner: credentialId,
            });

            console.log('[HANDLER] postReplyHandler Reply added successfully:', addedReply);


            const response = h.response({
                status: 'success',
                data: {
                    addedReply,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            console.error('[HANDLER] postReplyHandler - error:', error);
            throw error; // dilempar ke global error handler
        }

    }

    async deleteReplyHandler(request, h) {
        try {
            // console.log('[HANDLER] deleteReplyHandler - start');

            const { id: credentialId } = request.auth.credentials;
            // console.log('[HANDLER] deleteReplyHandler Authenticated user id:', credentialId);
            const { threadId, commentId, replyId } = request.params;
            // console.log('[HANDLER] deleteReplyHandler Params received - threadId:', threadId, 'commentId:', commentId);
            const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

            // console.log('[HANDLER] deleteReplyUseCase deleteReplyUseCase instance created');


            await deleteReplyUseCase.execute({
                threadId,
                commentId,
                replyId,
                owner: credentialId,
            });

            // console.log('[HANDLER] deleteReplyHandler Reply added successfully:', deleteReplyUseCase);

            return {
                status: 'success',
            };

        } catch (error) {
            // console.error('[HANDLER] deleteReplyHandler - error:', error);
            throw error; // dilempar ke global error handler
        }

    }
}

module.exports = RepliesHandler;