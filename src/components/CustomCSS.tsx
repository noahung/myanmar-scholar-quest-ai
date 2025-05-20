import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { RealtimeChannel } from '@supabase/supabase-js';

type CustomCSSRecord = {
  css: string;
};

export function CustomCSS() {
  useEffect(() => {
    async function loadCustomCSS() {
      try {
        const { data, error } = await supabase
          .from('custom_css')
          .select('css')
          .single();
        
        if (error) throw error;
        
        // Apply the CSS
        const styleEl = document.getElementById('custom-css') || document.createElement('style');
        styleEl.id = 'custom-css';
        styleEl.textContent = (data as CustomCSSRecord)?.css || '';
        
        if (!document.getElementById('custom-css')) {
          document.head.appendChild(styleEl);
        }
      } catch (error) {
        console.error('Error loading custom CSS:', error);
      }
    }
    
    loadCustomCSS();
    
    // Subscribe to changes in the custom_css table
    const channel = supabase
      .channel('custom_css_changes')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'custom_css'
        },
        (payload: { new: CustomCSSRecord }) => {
          const styleEl = document.getElementById('custom-css');
          if (styleEl) {
            styleEl.textContent = payload.new?.css || '';
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return null;
} 