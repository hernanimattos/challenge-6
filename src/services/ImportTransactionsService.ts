import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CsvTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    const contactsReadStream = fs.createReadStream(filePath);
    const parsers = csvParse({
      from_line: 2,
    });
    const parseCsv = contactsReadStream.pipe(parsers);
    const categories: Array<string> = [];
    const transactions: CsvTransaction[] = [];

    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value || !category) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCsv.on('end', resolve));

    const existCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existCategoriesTitle = existCategories.map(
      (cat: Category) => cat.title,
    );

    const addCategoryTitles = categories
      .filter(cat => !existCategoriesTitle.includes(cat))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existCategories];

    const createTransactions = transactionRepository.create(
      transactions.map(trans => ({
        title: trans.title,
        type: trans.type,
        value: trans.value,
        category: finalCategories.find(cat => cat.title === trans.category),
      })),
    );

    await transactionRepository.save(createTransactions);

    await fs.promises.unlink(filePath);

    return createTransactions;
  }
}

export default ImportTransactionsService;
