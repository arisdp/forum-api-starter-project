class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;

        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.verifyCommentAvailability(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, owner);

        return this._commentRepository.deleteComment(commentId);
    }
}

module.exports = DeleteCommentUseCase;