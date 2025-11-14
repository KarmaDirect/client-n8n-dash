# 🔑 Variables n8n : $env vs $vars

## 📚 Différence entre les deux types

### **1. Variables d'environnement système (`$env`)**
- ✅ **Disponibles sur TOUS les plans** (gratuit, Pro, Enterprise)
- ✅ Configurées au niveau du **serveur n8n** (variables d'environnement système)
- ✅ Utilisées dans les workflows avec : `={{ $env.VARIABLE_NAME }}`
- 📍 Configuration selon le déploiement :
  - **Railway** : Variables dans Railway Dashboard → Variables
  - **Docker** : Variables dans `docker-compose.yml` ou `.env`
  - **Local** : Fichier `.env` à la racine
  - **VPS** : Variables d'environnement système Linux

### **2. Variables n8n (`$vars`)**
- ❌ **Nécessitent le plan Enterprise**
- ❌ Configurées dans n8n UI → Settings → Variables
- ❌ Utilisées avec : `={{ $vars.VARIABLE_NAME }}`

---

## ✅ **NOTRE CAS : Utilisation de `$env`**

Tous nos workflows utilisent `$env` car :
- ✅ Pas besoin d'Enterprise plan
- ✅ Compatible avec Railway (déploiement actuel)
- ✅ Plus flexible pour différents environnements

### **Exemple dans un workflow** :
```javascript
// Node HTTP Request - URL
={{ $env.N8N_METRICS_URL }}

// Node HTTP Request - Header
{{$env.N8N_API_KEY}}
```

---

## ⚙️ **CONFIGURATION SUR RAILWAY**

### **Étape 1 : Ajouter les variables**

1. Va sur **Railway Dashboard** → Ton projet n8n
2. Onglet **Variables**
3. Clique **+ New Variable**
4. Ajoute :
   ```
   N8N_METRICS_URL = https://ijybwfdkiteebytdwhyu.supabase.co/functions/v1/receive-n8n-metrics
   N8N_API_KEY = ton-secret-ici
   ```

### **Étape 2 : Redémarrer le service**

⚠️ **Important** : Après avoir ajouté/modifié des variables :
1. Railway redémarre automatiquement, OU
2. Va dans **Settings** → **Deployments** → **Redeploy**

### **Étape 3 : Vérifier dans n8n**

Dans un workflow, tu peux tester avec un **Function node** :
```javascript
return [{ json: { url: $env.N8N_METRICS_URL, key: $env.N8N_API_KEY } }];
```

Si ça retourne les valeurs → ✅ **Ça fonctionne !**

---

## 🐛 **DÉPANNAGE**

### **Erreur : Variable is not defined**

**Causes possibles** :
1. Variable pas encore redémarrée → Redémarre le service n8n
2. Nom incorrect → Vérifie l'orthographe exacte (sensible à la casse)
3. Variable pas visible dans Railway → Vérifie que tu es dans le bon projet

### **Comment vérifier si les variables sont chargées**

1. Crée un workflow de test dans n8n
2. Ajoute un **Function node** :
   ```javascript
   return [{
     json: {
       metrics_url: $env.N8N_METRICS_URL,
       api_key_defined: !!$env.N8N_API_KEY
     }
   }];
   ```
3. Exécute le workflow
4. Si `metrics_url` est `undefined` → Variable pas chargée
5. Si `api_key_defined` est `false` → Variable pas définie

---

## 📝 **NOTES IMPORTANTES**

1. **Sécurité** : Ne mets JAMAIS de secrets dans le code du workflow
2. **Redémarrage** : Les variables `$env` nécessitent un redémarrage du service pour être chargées
3. **Environnements** : Tu peux avoir des variables différentes selon l'environnement (dev/prod)

---

## ✅ **CHECKLIST**

- [ ] Variables ajoutées dans Railway Variables
- [ ] Service n8n redémarré
- [ ] Test Function node retourne les valeurs
- [ ] Workflow utilise `={{ $env.VARIABLE }}` (pas `$vars`)
- [ ] Secret également configuré dans Supabase Edge Function

**Si tout est coché → Variables configurées correctement ! 🎉**






