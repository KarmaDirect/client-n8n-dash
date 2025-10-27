# 🚀 APPLIQUER LA MIGRATION MAINTENANT

## ⚠️ POURQUOI MANUEL ?

Le MCP Supabase et les outils automatiques ne peuvent pas exécuter du SQL brut directement. La méthode **la plus fiable et sécurisée** est d'utiliser le **SQL Editor** de Supabase.

---

## 📋 ÉTAPES (2 MINUTES)

### **Étape 1 : Ouvre le SQL Editor Supabase**

Clique sur ce lien :
👉 **https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/sql/new**

(Ça va ouvrir directement le SQL Editor de ton projet)

---

### **Étape 2 : Copie le SQL**

Ouvre le fichier suivant dans Cursor :

```
supabase/migrations/20250127000001_org_approval_system.sql
```

**Raccourci Cursor :**
1. Appuie sur **Cmd + P**
2. Tape : `20250127000001`
3. Appuie sur **Entrée**
4. Sélectionne tout : **Cmd + A**
5. Copie : **Cmd + C**

---

### **Étape 3 : Colle et Exécute**

1. Retourne sur l'onglet Supabase SQL Editor
2. **Colle le SQL** : **Cmd + V**
3. Clique sur le bouton **"Run"** (en bas à droite) ou appuie sur **Cmd + Enter**

---

### **Étape 4 : Vérifie le Résultat**

Tu devrais voir :

```
Success. No rows returned
```

Ou une liste de commandes exécutées avec succès.

---

## ✅ VÉRIFICATION RAPIDE

Une fois la migration appliquée, reviens me dire :

```
Vérifie que la migration a fonctionné
```

Et je vais tester :
1. ✅ La colonne `approved` existe
2. ✅ Le trigger `on_auth_user_created` est créé
3. ✅ Les fonctions RPC `approve_organization` et `reject_organization` existent
4. ✅ Les policies RLS sont mises à jour

---

## 🔗 LIENS RAPIDES

| Action | Lien |
|--------|------|
| **SQL Editor** | https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/sql/new |
| **Table Organizations** | https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/editor |
| **Database Triggers** | https://supabase.com/dashboard/project/ijybwfdkiteebytdwhyu/database/triggers |

---

## 📊 CE QUE LA MIGRATION VA FAIRE

1. ✅ Ajouter la colonne `approved` à `organizations`
2. ✅ Créer le trigger `on_auth_user_created` pour auto-créer l'organisation
3. ✅ Créer les fonctions RPC `approve_organization()` et `reject_organization()`
4. ✅ Mettre à jour les policies RLS pour bloquer si non approuvé
5. ✅ Créer la vue `pending_organizations` pour lister les organisations en attente

---

## ⏱️ TEMPS ESTIMÉ

**⏱️ 2 minutes maximum**

---

## 🆘 EN CAS DE PROBLÈME

Si tu vois une erreur, envoie-moi le message d'erreur complet et je t'aiderai à la résoudre.

---

**👉 Vas-y maintenant et reviens me dire quand c'est fait !** 🚀


