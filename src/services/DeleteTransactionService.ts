import { getCustomRepository, TransactionRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute({ id }: { id: string }): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError('nao existe');
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
