import { useQuery } from '@tanstack/react-query';
import { TransactionType2 } from '../../types';
import axiosInstance from '../axiosClient';

const getTransactions = async () => {
    const response = await axiosInstance.get('/transactions');
    return response.data;
};

export const useTransactions = () => {
    return useQuery<TransactionType2[]>({
        queryKey: ['transactions'],
        queryFn: getTransactions,
    });
};
