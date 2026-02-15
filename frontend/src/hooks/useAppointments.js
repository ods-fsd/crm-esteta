import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import api from '../utils/api';

export const useAppointments = () => {
    const queryClient = useQueryClient();

    // Отримання всіх записів
    const {
        data: appointments,
        isLoading,
        error
    } = useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const {
                data
            } = await api.get('/appointments');
            return data;
        },
    });

    // Створення запису
    const createAppointment = useMutation({
        mutationFn: (newAppointment) => api.post('/appointments', newAppointment),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            // Оновлюємо клієнтів також, бо змінюється дата останнього візиту
            queryClient.invalidateQueries(['clients']);
        },
    });

    // Видалення запису
    const deleteAppointment = useMutation({
        mutationFn: (id) => api.delete(`/appointments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
        },
    });

    return {
        appointments,
        isLoading,
        error,
        createAppointment: createAppointment.mutateAsync,
        deleteAppointment: deleteAppointment.mutateAsync
    };
};