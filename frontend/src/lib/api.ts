import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('tipjar_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    getNonce: (address: string) => api.post('/auth/nonce', { address }),
    verify: (address: string, signature: string) => api.post('/auth/verify', { address, signature }),
};

export const contentApi = {
    upload: (data: any) => api.post('/content/upload', data),
    list: (params: any) => api.get('/content', { params }),
    get: (id: string) => api.get(`/content/${id}`),
    getByCreator: (address: string) => api.get(`/content/creator/${address}`),
};

export const mediaApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const socialApi = {
    toggleLike: (contentId: string) => api.post('/likes/toggle', { contentId }),
    getLikeCount: (contentId: string) => api.get(`/likes/count/${contentId}`),
    checkLiked: (contentId: string) => api.get(`/likes/me/${contentId}`),
    getComments: (contentId: string) => api.get(`/comments/${contentId}`),
    postComment: (contentId: string, text: string) => api.post('/comments', { contentId, text }),
    updateComment: (commentId: string, text: string) => api.put(`/comments/${commentId}`, { text }),
    deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),
};

export default api;
