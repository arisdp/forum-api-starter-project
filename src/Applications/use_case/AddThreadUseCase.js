const NewThread = require('../../Domains/threads/entities/NewThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        console.log('[USECASE] AddThreadUseCase.execute - payload:', useCasePayload);
        const newThread = new NewThread(useCasePayload);
        const addedThread = await this._threadRepository.addThread(newThread);
        // return this._threadRepository.addThread(newThread);
        console.log('[USECASE] AddThreadUseCase.execute - success:', addedThread);
        return new AddedThread(addedThread); // <<< PENTING: Bungkus lagi hasil repo menjadi AddedThread    
    }
}

module.exports = AddThreadUseCase;  