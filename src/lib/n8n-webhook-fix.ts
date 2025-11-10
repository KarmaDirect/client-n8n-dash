/**
 * Utilitaire pour corriger les problèmes de webhooks n8n
 * 
 * Le problème : Les webhooks n8n ne s'enregistrent pas toujours correctement
 * après activation via l'API. C'est un comportement connu de n8n.
 * 
 * Solutions possibles :
 * 1. Faire un cycle désactivation/réactivation
 * 2. Attendre un délai après activation
 * 3. Vérifier que le webhook est bien enregistré
 */

interface WebhookActivationOptions {
  n8nApiUrl: string;
  n8nApiKey: string;
  workflowId: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Active un workflow et s'assure que le webhook est bien enregistré
 */
export async function activateWorkflowWithWebhook({
  n8nApiUrl,
  n8nApiKey,
  workflowId,
  maxRetries = 3,
  retryDelay = 2000,
}: WebhookActivationOptions): Promise<{ success: boolean; message: string }> {
  const headers = {
    "X-N8N-API-KEY": n8nApiKey,
    "Content-Type": "application/json",
  };

  // Normaliser l'URL
  const baseUrl = n8nApiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 1. Désactiver le workflow d'abord (pour réinitialiser le webhook)
      await fetch(`${baseUrl}/api/v1/workflows/${workflowId}/deactivate`, {
        method: "POST",
        headers,
      });

      // 2. Attendre un court instant
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Réactiver le workflow
      const activateRes = await fetch(
        `${baseUrl}/api/v1/workflows/${workflowId}/activate`,
        {
          method: "POST",
          headers,
        }
      );

      if (!activateRes.ok) {
        throw new Error(`Activation failed: ${activateRes.status}`);
      }

      // 4. Attendre que le webhook soit enregistré
      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      // 5. Vérifier que le workflow est bien actif
      const checkRes = await fetch(`${baseUrl}/api/v1/workflows/${workflowId}`, {
        headers,
      });

      if (!checkRes.ok) {
        throw new Error(`Check failed: ${checkRes.status}`);
      }

      const workflow = await checkRes.json();

      if (workflow.active) {
        // 6. Si le workflow contient un webhook, vérifier qu'il a un staticData
        const hasWebhook = workflow.nodes?.some(
          (node: any) => node.type?.includes("webhook")
        );

        if (hasWebhook) {
          // Note: n8n ne garantit pas que staticData soit immédiatement disponible
          // mais après le cycle désactivation/réactivation, le webhook devrait fonctionner
          console.log(
            `Webhook workflow ${workflowId} activated (attempt ${attempt}/${maxRetries})`
          );
        }

        return {
          success: true,
          message: "Workflow activé avec succès",
        };
      }
    } catch (error) {
      console.error(
        `Activation attempt ${attempt}/${maxRetries} failed:`,
        error
      );

      if (attempt === maxRetries) {
        return {
          success: false,
          message: `Échec de l'activation après ${maxRetries} tentatives: ${error}`,
        };
      }

      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return {
    success: false,
    message: "Échec de l'activation du workflow",
  };
}

/**
 * Récupère l'URL du webhook pour un workflow
 * Note: En production, l'URL est stable. En mode test, elle change à chaque exécution.
 */
export function getWebhookUrl(
  n8nBaseUrl: string,
  webhookPath: string,
  isTest: boolean = false
): string {
  const base = n8nBaseUrl.replace(/\/+$/, "");
  
  if (isTest) {
    // En mode test, l'URL contient un UUID unique
    console.warn(
      "Mode test: L'URL du webhook changera à chaque exécution. " +
      "Utilisez le mode production pour une URL stable."
    );
    return `${base}/webhook-test/${webhookPath}`;
  }
  
  return `${base}/webhook/${webhookPath}`;
}

/**
 * Instructions pour résoudre les problèmes de webhooks n8n
 */
export const WEBHOOK_TROUBLESHOOTING = `
Problèmes courants avec les webhooks n8n et leurs solutions :

1. **Webhook retourne 404 après activation**
   - Cause: n8n n'a pas enregistré le webhook correctement
   - Solution: Utiliser activateWorkflowWithWebhook() qui fait un cycle désactivation/réactivation

2. **Webhook fonctionne en test mais pas en production**
   - Cause: L'URL de test est différente de l'URL de production
   - Solution: S'assurer d'utiliser /webhook/ (production) et non /webhook-test/ (test)

3. **Webhook s'arrête de fonctionner après un certain temps**
   - Cause: Le workflow a été désactivé automatiquement (timeout, erreur)
   - Solution: Vérifier régulièrement le statut et réactiver si nécessaire

4. **Webhook ne reçoit pas les données**
   - Cause: Mauvaise méthode HTTP ou mauvais headers
   - Solution: Vérifier que la méthode (POST/GET) correspond à la configuration

5. **Variables d'environnement n8n nécessaires**
   - WEBHOOK_URL: L'URL de base de n8n (ex: https://n8n.example.com)
   - N8N_METRICS_URL: Pour l'envoi des métriques
   - N8N_METRICS_API_KEY: Clé API pour les métriques

Pour une solution robuste, toujours :
- Faire un cycle désactivation/réactivation lors du provisioning
- Attendre 2-3 secondes après activation avant de tester
- Implémenter des retry avec backoff exponentiel
- Logger les erreurs pour diagnostic
`;
