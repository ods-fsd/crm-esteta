import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import api from '../utils/api';

export const useClients = () => {
    const queryClient = useQueryClient();

    // 1. Отримання всіх клієнтів
    const {
        data: clients,
        isLoading,
        error
    } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const {
                data
            } = await api.get('/clients');
            return data;
        },
    });

    // 2. Додавання клієнта
    const addClientMutation = useMutation({
        mutationFn: (newClient) => api.post('/clients', newClient),
        onSuccess: () => {
            // Інвалідуємо кеш, щоб список оновився автоматично
            queryClient.invalidateQueries(['clients']);
        },
    });

    // 3. Оновлення клієнта
    const updateClientMutation = useMutation({
        mutationFn: ({
            id,
            data
        }) => api.put(`/clients/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['clients']);
        },
    });

    // 4. Видалення клієнта
    const deleteClientMutation = useMutation({
        mutationFn: (id) => api.delete(`/clients/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['clients']);
        },
    });

    return {
        clients,
        isLoading,
        error,
        addClient: addClientMutation.mutateAsync,
        updateClient: updateClientMutation.mutateAsync,
        deleteClient: deleteClientMutation.mutateAsync,
    };
};