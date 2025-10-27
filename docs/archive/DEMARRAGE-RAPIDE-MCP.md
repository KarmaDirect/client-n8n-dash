# ⚡ Démarrage Rapide MCP - Supabase & n8n

## 🎯 En 3 Minutes Chrono !

### Étape 1 : Configuration Supabase (2 min)

1. **Obtenez votre Service Role Key** :
   - 🔗 [Ouvrir API Settings](https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/settings/api)
   - Copiez la clé **service_role** (la longue clé secrète)

2. **Éditez la configuration** :
   ```bash
   nano ~/.cursor/mcp.json
   ```

3. **Remplacez** `VOTRE_SERVICE_ROLE_KEY_ICI` par votre vraie clé

4. **Sauvegardez** : `Ctrl+O` puis `Enter` puis `Ctrl+X`

### Étape 2 : Redémarrage Cursor (30 sec)

**Fermez COMPLÈTEMENT Cursor et relancez-le**

### Étape 3 : Premier Test (30 sec)

Dans le chat Cursor, testez :

```
Liste mes tables Supabase
```

```
@n8n-complete workflow_list
```

Si ça fonctionne → **🎉 C'EST BON !**

---

## 🚀 Commandes Essentielles

### Supabase (via MCP intégré)

```
Liste mes tables Supabase
Montre la structure de la table users
Combien d'utilisateurs dans ma base ?
Ajoute un utilisateur à la table users
```

### n8n (40+ commandes disponibles)

```
@n8n-complete workflow_list
@n8n-complete execution_list {"limit": 10}
@n8n-complete workflow_activate {"id": "123"}
@n8n-complete search_workflows {"query": "client"}
@n8n-complete tag_list
```

---

## 📚 Documentation Disponible

| Fichier | Pour quoi ? |
|---------|-------------|
| `README-MCP.md` | Vue d'ensemble MCP |
| `MCP-INSTALLATION-RESUME.md` | Résumé en 1 page |
| `N8N-MCP-GUIDE-COMPLET.md` | Guide détaillé n8n (11K) |
| `N8N-COMMANDES-REFERENCE.md` | Référence toutes commandes |
| `GUIDE-INSTALLATION-MCP.md` | Installation détaillée |
| `COMMANDES-MCP.md` | Commandes utiles |

---

## 🎯 Quick Wins

### 1. Explorer vos workflows n8n
```
@n8n-complete workflow_list
```

### 2. Voir les dernières exécutions
```
@n8n-complete execution_list {"limit": 10}
```

### 3. Rechercher un workflow
```
@n8n-complete search_workflows {"query": "email"}
```

### 4. Activer/Désactiver un workflow
```
@n8n-complete workflow_activate {"id": "123"}
@n8n-complete workflow_deactivate {"id": "123"}
```

### 5. Créer des tags pour organiser
```
@n8n-complete tag_create {"name": "Production"}
@n8n-complete tag_create {"name": "Dev"}
@n8n-complete tag_create {"name": "Client-A"}
```

### 6. Dupliquer un workflow
```
@n8n-complete duplicate_workflow {"id": "123", "newName": "Workflow V2"}
```

### 7. Voir vos credentials
```
@n8n-complete credential_list
```

### 8. Lister vos variables
```
@n8n-complete variable_list
```

### 9. Exporter un workflow (backup)
```
@n8n-complete export_workflow {"id": "123"}
```

### 10. Voir les utilisateurs
```
@n8n-complete user_list
```

---

## 🔥 Scénarios Pratiques

### Scénario 1 : Activer un workflow désactivé

```bash
# 1. Trouver le workflow
@n8n-complete search_workflows {"query": "nom_workflow"}

# 2. L'activer
@n8n-complete workflow_activate {"id": "ID_TROUVÉ"}

# 3. Vérifier les exécutions
@n8n-complete execution_list {"workflowId": "ID_TROUVÉ", "limit": 5}
```

### Scénario 2 : Débugger un workflow qui échoue

```bash
# 1. Voir les dernières exécutions
@n8n-complete execution_list {"limit": 10}

# 2. Lire les détails de l'erreur
@n8n-complete execution_read {"id": "EXECUTION_FAILED_ID"}

# 3. Relancer
@n8n-complete execution_retry {"id": "EXECUTION_FAILED_ID"}
```

### Scénario 3 : Organiser vos workflows

```bash
# 1. Créer des tags
@n8n-complete tag_create {"name": "Production"}
@n8n-complete tag_create {"name": "Client-ABC"}

# 2. Lister pour récupérer les IDs
@n8n-complete tag_list

# 3. Appliquer aux workflows
@n8n-complete workflowTags_update {"workflowId": "123", "tagIds": ["1", "2"]}
```

### Scénario 4 : Sauvegarder vos workflows importants

```bash
# Pour chaque workflow important
@n8n-complete export_workflow {"id": "123"}
# Copier le JSON quelque part en sécurité
```

---

## 💡 Astuces Pro

### 1. Utiliser la recherche
Au lieu de lister tous les workflows, recherchez :
```
@n8n-complete search_workflows {"query": "partie_du_nom"}
```

### 2. Limiter les résultats
Pour les grandes listes :
```
@n8n-complete execution_list {"limit": 5}
```

### 3. Filtrer par workflow
Voir seulement les exécutions d'un workflow :
```
@n8n-complete execution_list {"workflowId": "123"}
```

### 4. Tags pour l'organisation
Créez une taxonomie :
- **Environnement** : `Production`, `Staging`, `Dev`
- **Client** : `Client-A`, `Client-B`
- **Type** : `Email`, `CRM`, `Analytics`

### 5. Variables pour les secrets
Utilisez des variables au lieu de hard-coder :
```
@n8n-complete variable_create {"key": "STRIPE_KEY", "value": "sk_live_xxx"}
```

---

## 🐛 Problèmes Courants

### ❌ "Commande non reconnue"
**Solution** : Redémarrez Cursor complètement

### ❌ Erreur d'authentification Supabase
**Solution** : Vérifiez votre Service Role Key dans `~/.cursor/mcp.json`

### ❌ Erreur API n8n
**Solution** : L'instance n8n est peut-être hors ligne, vérifiez :
https://primary-production-bdba.up.railway.app

### ❌ Timeout
**Solution** : L'API peut être lente, réessayez

---

## 📊 Vos Instances

### Supabase
- **URL** : `https://ijybwfdkiteebytdwhyu.supabase.co`
- **Dashboard** : [Ouvrir Dashboard](https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu)

### n8n
- **URL** : `https://primary-production-bdba.up.railway.app`
- **API** : Déjà configurée ✅

---

## 🎓 Pour Aller Plus Loin

### Documentation Complète
- `N8N-MCP-GUIDE-COMPLET.md` - Guide détaillé avec tous les exemples
- `N8N-COMMANDES-REFERENCE.md` - Référence complète des 40+ commandes

### Apprendre Progressivement

**Semaine 1** : Commandes de base
```
workflow_list, workflow_read, execution_list
```

**Semaine 2** : Activation/Désactivation
```
workflow_activate, workflow_deactivate, execution_retry
```

**Semaine 3** : Organisation
```
tag_create, workflowTags_update, search_workflows
```

**Semaine 4** : Duplication & Backup
```
duplicate_workflow, export_workflow, import_workflow
```

**Semaine 5+** : Administration
```
user_create, project_create, variable_create, credential_create
```

---

## ✅ Checklist Finale

- [ ] Service Role Key Supabase configurée
- [ ] Cursor redémarré
- [ ] Test Supabase fonctionnel
- [ ] Test n8n fonctionnel
- [ ] Documentation consultée

### Si tout est ✅ :

**🎉 FÉLICITATIONS !**

Vous avez maintenant un **contrôle total** sur :
- ✅ Votre base de données Supabase
- ✅ Vos workflows n8n (40+ commandes)

**Directement depuis Cursor !** 🚀

---

## 🆘 Besoin d'Aide ?

1. Consultez la doc appropriée
2. Vérifiez les logs d'erreur
3. Testez les connexions API manuellement
4. Redémarrez Cursor

---

**💪 Vous êtes prêt à automatiser TOUT ! ⚡**

Bonne productivité ! 🚀✨

