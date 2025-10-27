# 📚 Index de la Documentation

**Navigation rapide vers toute la documentation du projet**

---

## 🚀 Démarrage rapide

Pour commencer avec le projet :
1. Lire [README.md](../README.md) (vue d'ensemble)
2. Suivre [DEVELOPMENT.md](DEVELOPMENT.md) (setup local)
3. Consulter [DEPLOYMENT.md](DEPLOYMENT.md) (déploiement)

---

## 📖 Documentation principale

| Document | Description | Audience |
|----------|-------------|----------|
| [README.md](../README.md) | Vue d'ensemble du projet, Quick Start | Tous |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture technique détaillée | Développeurs |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Guide du développeur, conventions | Développeurs |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guide de déploiement en production | DevOps |
| [API.md](API.md) | Documentation des APIs et endpoints | Développeurs |
| [SECURITY.md](SECURITY.md) | Sécurité, RLS, best practices | Tous |

---

## 🗂️ Structure de la documentation

```
docs/
├── INDEX.md              # Ce fichier (navigation)
├── ARCHITECTURE.md       # Architecture technique
├── DEVELOPMENT.md        # Guide du développeur
├── DEPLOYMENT.md         # Guide de déploiement
├── API.md                # Documentation API
├── SECURITY.md           # Sécurité
└── archive/             # Documentation historique (34 fichiers)
```

---

## 🎯 Guides par tâche

### **Je veux développer une nouvelle fonctionnalité**

1. [DEVELOPMENT.md](DEVELOPMENT.md) → Créer une nouvelle page
2. [ARCHITECTURE.md](ARCHITECTURE.md) → Comprendre la structure
3. [API.md](API.md) → Utiliser les APIs Supabase

### **Je veux déployer en production**

1. [DEPLOYMENT.md](DEPLOYMENT.md) → Guide complet
2. [SECURITY.md](SECURITY.md) → Checklist de sécurité

### **Je veux comprendre l'architecture**

1. [ARCHITECTURE.md](ARCHITECTURE.md) → Architecture globale
2. [SECURITY.md](SECURITY.md) → RLS et policies
3. [API.md](API.md) → Endpoints disponibles

### **Je veux résoudre un bug**

1. [DEVELOPMENT.md](DEVELOPMENT.md) → Debugging
2. [ARCHITECTURE.md](ARCHITECTURE.md) → Comprendre le flow
3. [SECURITY.md](SECURITY.md) → Vérifier les permissions

---

## 🔍 Recherche rapide

### **Frontend**

- [Créer une page](DEVELOPMENT.md#créer-une-nouvelle-page)
- [Créer un composant](DEVELOPMENT.md#créer-un-nouveau-composant-ui)
- [Routing](ARCHITECTURE.md#routing)
- [Stack frontend](ARCHITECTURE.md#frontend)

### **Backend**

- [Créer une migration SQL](DEVELOPMENT.md#créer-une-migration-sql)
- [RLS Policies](SECURITY.md#rls-policies)
- [Edge Functions](ARCHITECTURE.md#edge-functions-supabase)
- [RPC Functions](API.md#rpc-functions)

### **Intégrations**

- [n8n API](API.md#n8n-api-railway)
- [Stripe API](API.md#stripe-api)
- [MCPs](ARCHITECTURE.md#mcps-model-context-protocol)

### **Sécurité**

- [Authentification](SECURITY.md#authentification)
- [Autorisation](SECURITY.md#autorisation)
- [Failles corrigées](SECURITY.md#failles-corrigées)
- [Best practices](SECURITY.md#best-practices)

---

## 📁 Archive

La documentation historique (35+ fichiers) a été archivée dans `docs/archive/`.

**Fichiers archivés** :
- Anciens guides MCP (5 fichiers)
- Historique des améliorations UI (7 fichiers)
- Corrections appliquées (12 fichiers)
- Documentation système d'approbation (3 fichiers)
- Audits et résolutions (8 fichiers)

**Raison de l'archivage** : Documentation consolidée dans les 6 fichiers principaux.

---

## 🔄 Mises à jour

**Dernières mises à jour** :

- **27/01/2025** : Consolidation de 35 fichiers MD → 6 fichiers
- **27/01/2025** : Correction faille AdminApprovals.tsx (voir [SECURITY.md](SECURITY.md))
- **27/01/2025** : Système d'approbation implémenté (voir [ARCHITECTURE.md](ARCHITECTURE.md))

---

## 📞 Support

- **Email** : support@webstate.com
- **Issues** : Contacter l'équipe technique
- **Security** : hatim.moro.2002@gmail.com

---

## 🎯 Contribution

Ce projet est privé et propriétaire. Les contributions externes ne sont pas acceptées.

Pour les développeurs de l'équipe :
1. Lire [DEVELOPMENT.md](DEVELOPMENT.md)
2. Suivre les conventions de code
3. Respecter les best practices de sécurité ([SECURITY.md](SECURITY.md))

---

**📅 Dernière mise à jour** : 27 janvier 2025  
**📊 Fichiers de documentation** : 6 principaux + 34 archivés


