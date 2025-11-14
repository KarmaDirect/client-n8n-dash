# 🚀 WebState - Ressources & Liens Utiles

## 📚 Documentation Officielle

### Architecture & Technique
- [Architecture Technique](./ARCHITECTURE-TECHNIQUE.md) - Vue d'ensemble complète
- [Guide Partenaire](./README-PARTENAIRE.md) - Guide complet pour nouveaux partenaires
- [Guide de Démarrage Rapide](./GUIDE-DEMARRAGE-RAPIDE.md) - Setup en 5 minutes
- [Checklist Partenaire](./CHECKLIST-PARTENAIRE.md) - Checklist d'onboarding

### Documentation Projet
- [Architecture](../docs/ARCHITECTURE.md) - Architecture détaillée
- [API Reference](../docs/API.md) - Documentation API
- [Déploiement](../docs/DEPLOYMENT.md) - Guide de déploiement
- [Sécurité](../docs/SECURITY.md) - Bonnes pratiques sécurité
- [Développement](../docs/DEVELOPMENT.md) - Guide de développement

## 🔗 Liens Importants

### Repositories & Code
- **GitHub Principal** : https://github.com/KarmaDirect/client-n8n-dash
- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Edge Functions)
- **Workflows** : n8n (Railway)

### Services & Dashboards
- **Supabase Dashboard** : https://supabase.com/dashboard
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Railway Dashboard** : https://railway.app/dashboard
- **Stripe Dashboard** : https://dashboard.stripe.com

### n8n Instance
- **URL** : https://n8n.railway.app
- **API** : https://n8n.railway.app/api/v1/
- **Documentation** : https://docs.n8n.io/

## 🛠️ Outils de Développement

### IDE & Éditeurs
- **VS Code** (recommandé) : https://code.visualstudio.com/
- **Extensions utiles** :
  - Supabase
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - GitLens
  - Thunder Client (API testing)

### CLI & Outils
- **Supabase CLI** : `npm install -g supabase`
- **Vercel CLI** : `npm install -g vercel`
- **Railway CLI** : `npm install -g @railway/cli`

### Testing & Debugging
- **React DevTools** : Extension Chrome/Firefox
- **Supabase DevTools** : Extension Chrome
- **Network Tab** : Pour debugger les API calls
- **Console** : Pour les logs JavaScript

## 📖 Documentation Externe

### Technologies Principales
- **React** : https://react.dev/
- **TypeScript** : https://www.typescriptlang.org/
- **Vite** : https://vitejs.dev/
- **Tailwind CSS** : https://tailwindcss.com/
- **shadcn/ui** : https://ui.shadcn.com/

### Backend & Services
- **Supabase** : https://supabase.com/docs
- **n8n** : https://docs.n8n.io/
- **Stripe** : https://stripe.com/docs
- **SendGrid** : https://docs.sendgrid.com/
- **Twilio** : https://www.twilio.com/docs
- **OpenAI** : https://platform.openai.com/docs

## 🔧 Commandes Utiles

### Développement Local
```bash
# Démarrer le serveur de dev
npm run dev

# Build de production
npm run build

# Tests
npm run test

# Linting
npm run lint
```

### Supabase
```bash
# Démarrer Supabase local
supabase start

# Arrêter Supabase local
supabase stop

# Appliquer les migrations
supabase db push

# Déployer les Edge Functions
supabase functions deploy

# Générer les types TypeScript
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Git
```bash
# Nouvelle feature
git checkout -b feature/nom-feature

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/nom-feature

# Pull Request
gh pr create --title "feat: description" --body "Description détaillée"
```

## 🎯 Workflows n8n Disponibles

### Pack START (97€/mois)
1. **Lead Capture Basic** : Webhook → Validation → Supabase → Métriques
2. **Email Auto Reply** : Gmail/IMAP → Template → SMTP → Métriques

### Pack PRO (297€/mois)
3. **Lead Capture Enrich** : Webhook → Enrichissement API → IF Score → DB
4. **CRM Sync Supabase** : Cron → Supabase Select → Map → HTTP CRM
5. **Notify Slack Errors** : Event Error → Format → Slack Webhook

### Pack ELITE (997-2,997€/mois)
6. **Omni Intake Orchestrator** : Webhook → Router → Normalize → Fan-out
7. **NPS Collector** : Cron → Fetch Recipients → Send → Collect → Aggregate
8. **KPI Daily Report** : Cron → Compute KPIs → Render → Email/Slack

## 🔐 Variables d'Environnement

### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_N8N_API_URL=https://n8n.railway.app
VITE_N8N_API_KEY=your_n8n_api_key
```

### Edge Functions
```bash
SUPABASE_URL=https://ijybwfdkiteebytdwhyu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
N8N_API_URL=https://n8n.railway.app
N8N_API_KEY=your_n8n_api_key
TWILIO_API_KEY=sk_...
SENDGRID_API_KEY=SG...
OPENAI_API_KEY=sk-...
```

## 📊 Métriques & Monitoring

### KPIs Principaux
- **Exécutions** : Nombre de workflows exécutés
- **Succès** : Taux de succès des exécutions
- **Erreurs** : Nombre et types d'erreurs
- **Coûts** : Coût par exécution
- **Gains** : Temps économisé, revenus générés

### Dashboards
- **Supabase** : Métriques base de données
- **Vercel** : Métriques frontend
- **Railway** : Métriques n8n
- **Stripe** : Métriques paiements

## 🚨 Support & Debugging

### Logs Importants
- **Frontend** : Console du navigateur
- **Backend** : Supabase Dashboard → Edge Functions → Logs
- **n8n** : Railway Dashboard → Logs
- **Base de données** : Supabase Dashboard → Logs

### Problèmes Courants
1. **Variables d'environnement** : Vérifier les clés API
2. **RLS** : Vérifier les policies de sécurité
3. **CORS** : Vérifier les headers CORS
4. **Rate limiting** : Respecter les quotas API
5. **Timeout** : Optimiser les requêtes longues

## 📞 Contacts

### Équipe
- **Yasmine Moro** : Founder & Tech Lead
  - Email : yasminemoro@webstate.fr
  - Responsable : Architecture, stratégie technique

### Support Technique
- **GitHub Issues** : Pour les bugs et features
- **Slack** : Pour les questions rapides
- **Email** : Pour les questions importantes

## 🎉 Célébration

Une fois que vous maîtrisez ces ressources, vous êtes prêt à contribuer activement à WebState ! 🚀

### Prochaines Étapes
1. **Explorer** le code et la documentation
2. **Tester** le système de provisioning
3. **Contribuer** avec vos premières modifications
4. **Proposer** de nouvelles améliorations

---

**Bienvenue dans l'équipe WebState ! 🎯**

---

*Ressources créées le 27 janvier 2025 - Version 1.0*






