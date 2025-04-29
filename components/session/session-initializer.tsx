'use client';

import { useEffect } from 'react';
import { getClientSession } from '@/lib/clientSession';
import { useAuth } from '@/hooks/useAuth';

export const SessionInitializer = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Only initialize guest session if user is not logged in
        if (!user) {
            try {
                const sessionId = getClientSession();
                console.log('Guest session initialized:', sessionId);
            } catch (error) {
                console.error('Failed to initialize guest session:', error);
            }
        }
    }, [user]);

    return null;
};