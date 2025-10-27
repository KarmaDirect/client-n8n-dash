# 🚀 Client n8n Dashboard - SaaS Multi-tenant

**Plateforme SaaS pour gérer des agents d'automatisation n8n par client**

![Status](https://img.shields.io/badge/status-production%20ready-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Security](https://img.shields.io/badge/security-audited-brightgreen)

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Stack technique](#stack-technique)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Sécurité](#sécurité)

---

## 🎯 Vue d'ensemble

**Client n8n Dashboard** est une plateforme SaaS multi-tenant qui permet de :
- ✅ Gérer des workflows n8n pour plusieurs clients
- ✅ Système d'approbation manuelle des comptes
- ✅ Isolation complète des données (RLS Supabase)
- ✅ Intégration Stripe pour les abonnements
- ✅ MCPs pour gérer n8n et Supabase depuis Cursor

---

## 🛠️ Stack technique

### **Frontend**
- **React 18** + TypeScript
- **Vite** (build & dev server)
- **Tailwind CSS** + Shadcn/UI
- **React Router** (routing)
- **TanStack Query** (state management)
- **Framer Motion** (animations)

### **Backend**
- **Supabase** (BaaS)
  - Auth (JWT)
  - PostgreSQL (database)
  - Edge Functions (serverless)
  - Storage (files)
- **Stripe** (payments)
- **n8n** (workflows automation)

### **Infrastructure**
- **Railway** (n8n hosting)
- **Vercel/Netlify** (frontend hosting)
- **Supabase Cloud** (database)

---

## ⚡ Quick Start

### **Prérequis**

- Node.js 18+
- npm ou bun
- Compte Supabase
- Compte Stripe (mode test)
- Instance n8n (Railway)

### **Installation**

```bash
# 1. Cloner le repo
git clone <repo-url>
cd client-n8n-dash

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de dev
npm run dev
```

### **Configuration**

Créer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🏗️ Architecture

### **Structure du projet**

```
client-n8n-dash/
├── src/
│   ├── components/       # Composants React réutilisables
│   ├── pages/           # Pages de l'application
│   ├── context/         # Contextes React (Auth)
│   ├── hooks/           # Hooks personnalisés
│   ├── integrations/    # Intégrations externes (Supabase)
│   └── lib/             # Utilitaires
├── supabase/
│   ├── functions/       # Edge Functions
│   └── migrations/      # Migrations SQL
├── custom-mcp-servers/  # Serveurs MCP
└── docs/               # Documentation
```

### **Multi-tenancy**

Chaque client a :
- ✅ Une **organisation** isolée
- ✅ Des **workflows n8n** dédiés
- ✅ Un **abonnement Stripe** individuel
- ✅ Ses propres **données** (RLS)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique détaillée |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Guide de déploiement |
| [API.md](docs/API.md) | Documentation des APIs |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md) | Guide du développeur |
| [SECURITY.md](docs/SECURITY.md) | Sécurité et best practices |

---

## 🔐 Sécurité

### **Authentification**

- ✅ JWT via Supabase Auth
- ✅ Validation email obligatoire
- ✅ Reset password sécurisé
- ✅ Système d'approbation manuelle

### **Autorisation**

- ✅ RLS (Row Level Security)
- ✅ Policies strictes par organisation
- ✅ Rôles utilisateur (admin, user)
- ✅ Service Role Key protégée

### **Audit de sécurité**

- ✅ Faille AdminApprovals.tsx corrigée (27/01/2025)
- ✅ RLS vérifié sur toutes les tables
- ✅ Code conforme OWASP

**Voir** : [SECURITY.md](docs/SECURITY.md) pour plus de détails

---

## 🚀 Fonctionnalités

### **Pour les clients**

- ✅ Dashboard moderne et intuitif
- ✅ Gestion des workflows n8n
- ✅ Historique des exécutions
- ✅ Support intégré
- ✅ Abonnement Stripe

### **Pour les admins**

- ✅ Dashboard admin complet
- ✅ Approbation manuelle des comptes
- ✅ Gestion des organisations
- ✅ Impersonation client
- ✅ Statistiques globales

---

## 🧪 Tests

```bash
# Linter
npm run lint

# Build de production
npm run build

# Preview du build
npm run preview
```

---

## 📦 Déploiement

### **Frontend**

```bash
# Build de production
npm run build

# Deploy sur Vercel
vercel --prod

# Ou Netlify
netlify deploy --prod
```

### **Supabase**

```bash
# Appliquer les migrations
# Via Supabase Dashboard > SQL Editor
# Ou via CLI Supabase (si installé)
```

**Voir** : [DEPLOYMENT.md](docs/DEPLOYMENT.md) pour le guide complet

---

## 🤝 Contribution

Ce projet est privé et propriétaire. Les contributions externes ne sont pas acceptées.

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

## 📞 Support

- **Email** : support@webstate.com
- **Documentation** : [docs/](docs/)
- **Issues** : Contacter l'équipe technique

---

## 🎯 Roadmap

- [x] Système d'authentification complet
- [x] Multi-tenancy avec RLS
- [x] Approbation manuelle des comptes
- [x] Intégration Stripe
- [x] MCPs n8n et Supabase
- [ ] Tests unitaires (en cours)
- [ ] Tests d'intégration
- [ ] Monitoring et logs
- [ ] Rate limiting
- [ ] Captcha sur signup

---

## 🔧 Troubleshooting

### **Problème : Build échoue**

```bash
# Nettoyer les caches
rm -rf node_modules dist .vite
npm install
npm run build
```

### **Problème : Erreurs Supabase**

- Vérifier les variables d'environnement
- Vérifier que les migrations sont appliquées
- Vérifier les permissions RLS

### **Problème : MCPs ne fonctionnent pas**

- Redémarrer Cursor complètement (Cmd+Q)
- Vérifier `~/.cursor/mcp.json`
- Vérifier les credentials n8n et Supabase

---

## 📊 Statistiques du projet

- **35 fichiers MD** → **6 fichiers consolidés**
- **22 pages React**
- **16 tables Supabase**
- **24 migrations SQL**
- **7 Edge Functions**
- **2 MCPs** (n8n + Supabase)

---

**🚀 Version** : 1.0.0  
**📅 Dernière mise à jour** : 27 janvier 2025  
**✅ Status** : Production Ready
