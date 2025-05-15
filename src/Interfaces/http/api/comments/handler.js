const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        // Manual binding
        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        try {
            // console.log('[HANDLER] postCommentHandler - start');

            // Extract credentials and params
            const { id: credentialId } = request.auth.credentials;
            const { threadId } = request.params;
            const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

            // Debugging payload and auth details
            // console.log('[DEBUG] Payload diterima oleh postCommentHandler:', request.payload);
            // console.log('[DEBUG] Auth credentials:', request.auth);

            // Execute the use case
            const addedComment = await addCommentUseCase.execute({
                ...request.payload,
                threadId,
                owner: credentialId,
            });

            // console.log('[HANDLER] postCommentHandler - success');

            // Prepare response
            const response = h.response({
                status: 'success',
                data: {
                    addedComment,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            // console.error('[HANDLER] postCommentHandler - error:', error);
            throw error; // Will be caught by the global error handler
        }
    }

    async deleteCommentHandler(request, h) {
        try {
            // console.log('[HANDLER] deleteCommentHandler - start');

            // Extract credentials and params
            const { id: credentialId } = request.auth.credentials;
            const { threadId, commentId } = request.params;
            const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

            // Debugging payload and auth details
            // console.log('[DEBUG] Payload diterima oleh deleteCommentHandler:', request.payload);
            // console.log('[DEBUG] Auth credentials:', request.auth);

            // Execute the use case
            await deleteCommentUseCase.execute({
                threadId,
                commentId,
                owner: credentialId,
            });

            // console.log('[HANDLER] deleteCommentHandler - success');
            return {
                status: 'success',
            };
        } catch (error) {
            // console.error('[HANDLER] deleteCommentHandler - error:', error);
            throw error; // Will be caught by the global error handler
        }
    }
}

module.exports = CommentsHandler;