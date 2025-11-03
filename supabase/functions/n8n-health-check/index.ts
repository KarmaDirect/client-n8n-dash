import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const N8N_API_URL = Deno.env.get('N8N_API_URL');
    const N8N_API_KEY = Deno.env.get('N8N_API_KEY');

    if (!N8N_API_URL || !N8N_API_KEY) {
      return new Response(
        JSON.stringify({ 
          status: 'error',
          message: 'N8N_API_URL or N8N_API_KEY not configured'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Normaliser l'URL
    let n8nBaseUrl = N8N_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
    
    const n8nHeaders = {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Health check simple : vérifier que l'API répond
    try {
      // Essayer de lister les workflows (endpoint léger)
      const healthUrl = `${n8nBaseUrl}/api/v1/workflows?limit=1`;
      const healthRes = await fetch(healthUrl, { 
        headers: n8nHeaders,
        method: 'GET'
      });

      if (healthRes.ok) {
        return new Response(
          JSON.stringify({ 
            status: 'healthy',
            connected: true,
            message: 'n8n API is accessible'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        // Si erreur 401/403, c'est un problème d'auth
        // Si erreur 404, l'API existe mais l'endpoint n'existe pas (peu probable)
        // Si erreur 500+, serveur n8n en panne
        const status = healthRes.status;
        return new Response(
          JSON.stringify({ 
            status: status >= 500 ? 'down' : 'degraded',
            connected: false,
            message: `n8n API returned status ${status}`,
            status_code: status
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } catch (fetchError: any) {
      // Erreur réseau (timeout, connection refused, etc.)
      return new Response(
        JSON.stringify({ 
          status: 'down',
          connected: false,
          message: fetchError.message || 'Failed to connect to n8n API',
          error: fetchError.message
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error: any) {
    console.error('[n8n-health-check] Error:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error',
        connected: false,
        message: error.message || 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

