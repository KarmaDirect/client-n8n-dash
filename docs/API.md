# 📡 Documentation API

**API Endpoints et Fonctions**

---

## 🔑 Authentification

Toutes les requêtes authentifiées nécessitent un **JWT token** dans le header :

```http
Authorization: Bearer <jwt_token>
```

---

## 📋 Supabase Tables

### **Organizations**

```typescript
GET /rest/v1/organizations
  → Liste les organisations (RLS appliqué)

POST /rest/v1/organizations
  → Créer une organisation
  Body: { name: string, owner_id: uuid }

PATCH /rest/v1/organizations?id=eq.<org_id>
  → Modifier une organisation
  Body: { name?: string, approved?: boolean }
```

### **Workflows**

```typescript
GET /rest/v1/workflows?org_id=eq.<org_id>
  → Liste les workflows d'une org

POST /rest/v1/workflows
  → Créer un workflow
  Body: { 
    org_id: uuid, 
    name: string, 
    n8n_workflow_id?: string,
    description?: string 
  }
```

---

## ⚡ Edge Functions

### **bootstrap-admin**

Créer le premier admin.

```http
POST /functions/v1/bootstrap-admin
Content-Type: application/json

{
  "email": "admin@webstate.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "message": "Admin created successfully",
  "user_id": "uuid"
}
```

### **check-subscription**

Vérifier l'abonnement de l'utilisateur.

```http
POST /functions/v1/check-subscription
Authorization: Bearer <jwt>

Response:
{
  "subscribed": true,
  "plan": "pro",
  "stripe_customer_id": "cus_xxx"
}
```

### **create-checkout**

Créer une session Stripe Checkout.

```http
POST /functions/v1/create-checkout
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "plan": "starter" | "pro",
  "interval": "month" | "year"
}

Response:
{
  "url": "https://checkout.stripe.com/...",
  "session_id": "cs_xxx"
}
```

### **customer-portal**

Accéder au portail client Stripe.

```http
POST /functions/v1/customer-portal
Authorization: Bearer <jwt>

Response:
{
  "url": "https://billing.stripe.com/..."
}
```

### **execute-webhook**

Exécuter un webhook n8n.

```http
POST /functions/v1/execute-webhook
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "webhook_id": "uuid",
  "data": { ... }
}

Response:
{
  "success": true,
  "execution_id": "uuid",
  "result": { ... }
}
```

---

## 🔄 RPC Functions

### **approve_organization**

Approuver une organisation (admin seulement).

```sql
SELECT * FROM approve_organization('org-uuid');

Response:
{
  "success": true,
  "message": "Organisation approuvée avec succès",
  "org_id": "uuid"
}
```

### **reject_organization**

Rejeter et supprimer une organisation (admin seulement).

```sql
SELECT * FROM reject_organization('org-uuid');

Response:
{
  "success": true,
  "message": "Organisation rejetée et supprimée",
  "org_id": "uuid"
}
```

---

## 🤖 n8n API (Railway)

### **Base URL**

```
https://primary-production-bdba.up.railway.app/api/v1
```

### **Headers**

```http
X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### **Endpoints principaux**

```http
GET /workflows
  → Liste tous les workflows

GET /workflows/:id
  → Détails d'un workflow

POST /workflows
  → Créer un workflow

PATCH /workflows/:id/activate
  → Activer un workflow

GET /executions
  → Liste des exécutions

GET /executions/:id
  → Détails d'une exécution
```

**Documentation complète** : https://docs.n8n.io/api/

---

## 💳 Stripe API

### **Plans disponibles**

```typescript
const PLANS = {
  starter: {
    monthly: { price_id: "price_xxx", amount: 9700 }, // 97€
    yearly: { price_id: "price_xxx", amount: 93000 }  // 930€
  },
  pro: {
    monthly: { price_id: "price_xxx", amount: 29700 }, // 297€
    yearly: { price_id: "price_xxx", amount: 285000 }  // 2850€
  }
};
```

### **Webhooks**

Événements écoutés :

- `checkout.session.completed` : Abonnement créé
- `invoice.paid` : Paiement réussi
- `invoice.payment_failed` : Paiement échoué
- `customer.subscription.deleted` : Abonnement annulé
- `customer.subscription.updated` : Abonnement modifié

---

## 📊 MCPs (Model Context Protocol)

### **MCP n8n**

```typescript
// Via Cursor
@n8n workflow_list
@n8n workflow_read { "id": "workflow_id" }
@n8n workflow_create { "name": "...", "nodes": [...] }
```

### **MCP Supabase**

```typescript
// Via Cursor
@supabase list_tables { "project_id": "ijybwfdkiteebytdwhyu" }
@supabase execute_sql { "project_id": "...", "query": "..." }
@supabase apply_migration { "project_id": "...", "name": "...", "query": "..." }
```

---

## 🔐 Sécurité

### **Rate Limiting**

- ❌ Non implémenté (à faire)
- Recommandation : Cloudflare ou Vercel Edge Config

### **CORS**

Configuré automatiquement par Supabase :

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

---

## 📋 Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (JWT invalide) |
| 403 | Forbidden (RLS bloqué) |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## 🧪 Exemples

### **Inscription**

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});
```

### **Login**

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});
```

### **Lister les workflows**

```typescript
const { data, error } = await supabase
  .from('workflows')
  .select('*')
  .eq('org_id', orgId);
```

### **Approuver une organisation**

```typescript
const { data, error } = await supabase.rpc('approve_organization', {
  org_id_param: 'uuid'
});
```

---

**📅 Dernière mise à jour** : 27 janvier 2025


