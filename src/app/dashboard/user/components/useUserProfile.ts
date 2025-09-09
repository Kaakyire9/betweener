import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
  const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) throw new Error('No user');
        const { data, error } = await supabaseBrowser
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile({ ...data, email: user.email });
      } catch (err) {
        let message = 'Failed to load profile';
        if (err instanceof Error) message = err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return { profile, loading, error };
}
