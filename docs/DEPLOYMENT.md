# 🚀 Guide de Déploiement

**Guide complet pour déployer Client n8n Dashboard en production**

---

## 📋 Prérequis

- ✅ Compte Vercel ou Netlify
- ✅ Projet Supabase configuré
- ✅ Instance n8n sur Railway
- ✅ Compte Stripe (mode production)
- ✅ Domaine personnalisé (optionnel)

---

## 1️⃣ Préparer le projet

### **Build local**

```bash
# Tester le build
npm run build

# Vérifier la taille du bundle
ls -lh dist/

# Tester le build localement
npm run preview
```

### **Variables d'environnement**

Créer `.env.production` :

```env
VITE_SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2️⃣ Supabase

### **Appliquer les migrations**

1. Va sur https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/sql/new
2. Exécute les migrations dans l'ordre :
   ```sql
   -- 1. Système d'approbation
   supabase/migrations/20250127000001_org_approval_system.sql
   
   -- 2. Vue sécurisée admin
   supabase/migrations/20250127000002_create_pending_orgs_view.sql
   ```

### **Vérifier les Edge Functions**

```bash
# Via Dashboard Supabase > Edge Functions
- bootstrap-admin
- execute-webhook
- check-subscription
- create-checkout
- customer-portal
```

### **Configurer les webhooks Stripe**

1. Dashboard Stripe > Webhooks
2. Ajouter endpoint : `https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/stripe-webhook`
3. Événements : `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`

---

## 3️⃣ Déploiement Frontend

### **Option A : Vercel (Recommandé)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### **Option B : Netlify**

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### **Configuration Vercel**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

---

## 4️⃣ Configuration DNS

### **Domaine personnalisé**

```
app.webstate.com → Vercel/Netlify
api.webstate.com → Supabase (CNAME)
```

### **SSL/TLS**

- ✅ Automatique avec Vercel/Netlify
- ✅ Certificat Let's Encrypt

---

## 5️⃣ Post-déploiement

### **Checklist de vérification**

- [ ] Site accessible (https://app.webstate.com)
- [ ] Login fonctionne
- [ ] Signup fonctionne
- [ ] Dashboard charge
- [ ] Admin dashboard accessible
- [ ] Stripe checkout fonctionne
- [ ] Webhooks Stripe reçus
- [ ] n8n workflows exécutent

### **Créer le premier admin**

```bash
# Via Edge Function bootstrap-admin
curl -X POST https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@webstate.com", "password": "SecurePassword123!"}'
```

---

## 6️⃣ Monitoring

### **Supabase**

- Dashboard > Observability
- Logs des requêtes SQL
- Erreurs Edge Functions

### **Vercel/Netlify**

- Analytics
- Logs de déploiement
- Performance metrics

### **Stripe**

- Dashboard > Developers > Webhooks
- Vérifier les événements reçus

---

## 🔄 Rollback

### **En cas de problème**

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

### **Supabase**

- Pas de rollback automatique des migrations
- Créer une migration inverse manuellement

---

## ⚡ Optimisations

### **Performance**

- [ ] Activer compression gzip (automatique)
- [ ] CDN pour assets statiques (automatique)
- [ ] Cache headers optimisés
- [ ] Lazy loading des routes

### **SEO**

- [ ] Meta tags configurés
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Open Graph tags

---

## 🔐 Sécurité

### **Headers HTTP**

Configurer dans `vercel.json` ou `netlify.toml` :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📊 Environnements

| Env | URL | Branch | Database |
|-----|-----|--------|----------|
| **Dev** | localhost:5173 | - | Supabase prod |
| **Staging** | staging.webstate.com | `develop` | Supabase prod |
| **Production** | app.webstate.com | `main` | Supabase prod |

---

## 🆘 Troubleshooting

### **Build échoue**

```bash
# Nettoyer et rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### **Variables d'environnement manquantes**

- Vérifier `.env.production`
- Vérifier configuration Vercel/Netlify

### **Erreurs Supabase**

- Vérifier que toutes les migrations sont appliquées
- Vérifier les permissions RLS
- Vérifier les Edge Functions déployées

---

**📅 Dernière mise à jour** : 27 janvier 2025


