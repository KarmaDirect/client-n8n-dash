# ✅ Test Final du Provisioning - Après Configuration de la Clé API

## 🎯 **Vérifications Avant le Test**

### **1. Vérifier la Clé API dans Supabase**

Vous êtes sur la page de `manage-client-workflows`. Vérifiez :

1. **Cliquez sur** : **"Settings"** (en haut à droite)
2. **Scrollez jusqu'à** : **"Environment variables"**
3. **Vérifiez** que `N8N_API_KEY` contient bien :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YTg2Y2Q4ZC1jMTU2LTQxMTktOThlNy0wNDhkOTkyMjI5NjAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYxNzgyMTgwfQ.YdeKdFxqGDqo7gA2qxYNsTEMLrDm-0whk4UY0czeEMk
   ```
4. **Vérifiez** que `N8N_API_URL` = `https://primary-production-bdba.up.railway.app` (sans `/api/v1`)

### **2. Vérifier que la Fonction est Déployée**

Sur la page actuelle, vérifiez :
- **"Last updated at"** : Doit être récent (après avoir modifié la clé)
- **"Deployments"** : Devrait afficher **19** ou plus

---

## 🧪 **Test du Provisioning**

### **Étape 1 : Aller sur le Dashboard Admin**

1. **Ouvrez** : http://localhost:8080/app/admin/workflows
   - OU si votre serveur est sur un autre port : `http://127.0.0.1:VOTRE_PORT/app/admin/workflows`

### **Étape 2 : Sélectionner un Client**

1. **Dans le dropdown** "Sélectionner un client", choisissez :
   - `hatim.moro.2002@gmail.com`
   - Ou tout autre client disponible

### **Étape 3 : Aller dans l'Onglet "Start"**

1. **Cliquez sur** l'onglet **"Start"**

### **Étape 4 : Provisionner "Hello World Test"**

1. **Cochez** la case à côté de **"Hello World Test"**
2. **Cliquez sur** **"Provisionner (1)"**

### **Étape 5 : Observer le Résultat**

**✅ Si ça fonctionne** :
- Vous verrez un toast vert : **"✅ Provisioning réussi - 1 workflows copiés, 1 activés"**
- Le workflow apparaîtra dans l'onglet **"Client Workflows"**
- Le workflow sera visible dans n8n avec le préfixe `[Nom du Client]`

**❌ Si ça ne fonctionne pas** :
- Un toast rouge avec un message d'erreur
- Ouvrez la console du navigateur (F12) pour voir l'erreur détaillée
- Consultez les logs Supabase (voir ci-dessous)

---

## 🔍 **Vérifier les Logs Supabase**

Si vous obtenez une erreur :

1. **Revenez sur la page** que vous avez ouverte (Functions → manage-client-workflows)
2. **Cliquez sur** l'onglet **"Logs"**
3. **Regardez les logs les plus récents**

**Logs attendus (si ça fonctionne)** :
```
[manage-client-workflows] n8n Base URL: https://primary-production-bdba.up.railway.app
[manage-client-workflows] API Key prefix: eyJhbGciOiJIUzI1NiIs...
[provision] Making request to: https://primary-production-bdba.up.railway.app/api/v1/workflows/DcbL3KktSssdT3Es
[provision] Response Content-Type: application/json, Status: 200
[provision] Successfully fetched workflow from n8n: Hello World Test (DcbL3KktSssdT3Es)
```

**Si vous voyez encore du HTML** :
```
[provision] Response Content-Type: text/html; charset=utf-8, Status: 200
```
→ La clé API dans Supabase n'est pas la bonne ou n'a pas été redéployée.

---

## 📝 **Checklist de Test**

- [ ] Clé API configurée dans Supabase Environment variables
- [ ] Fonction redéployée après modification de la clé
- [ ] Testé le provisioning depuis `/app/admin/workflows`
- [ ] Résultat : Toast de succès OU vérifié les logs pour l'erreur

---

## 🎉 **Si ça Fonctionne**

Félicitations ! Le provisioning devrait maintenant :
1. ✅ Récupérer le workflow depuis n8n (JSON)
2. ✅ Créer une copie pour le client dans n8n
3. ✅ L'insérer dans Supabase
4. ✅ L'activer automatiquement si possible

---

**Document créé le 31 janvier 2025**






