# 🔐 Générer un Secret API Fort

## ⚠️ **IMPORTANT**

Ne utilise **JAMAIS** `webstate-test-secret-2025-xyz123` en production !
C'était juste un exemple dans la documentation.

---

## 🔑 **GÉNÉRER UN SECRET FORT**

### **Option 1 : Via OpenSSL (recommandé)**

```bash
openssl rand -hex 32
```

**Exemple de résultat** :
```
a7f3b8c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9
```

### **Option 2 : Via Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Option 3 : En ligne**

- https://randomkeygen.com/ (section "CodeIgniter Encryption Keys")
- https://www.uuidgenerator.net/

---

## ✅ **UTILISATION**

1. **Génère un secret** avec une des méthodes ci-dessus
2. **Utilise-le dans Railway** :
   ```
   N8N_API_KEY = [TON_SECRET_GÉNÉRÉ]
   ```
3. **Utilise le MÊME secret dans Supabase** :
   ```
   N8N_METRICS_API_KEY = [MÊME_SECRET]
   ```

---

## 🔒 **BONNES PRATIQUES**

- ✅ Longueur minimum : 32 caractères (64 en hex)
- ✅ Utilise des caractères aléatoires (pas de mots du dictionnaire)
- ✅ Ne partage JAMAIS le secret
- ✅ Utilise des secrets différents pour dev/prod
- ✅ Stocke-le dans un gestionnaire de secrets (1Password, Bitwarden, etc.)

---

## 📝 **EXEMPLE COMPLET**

```bash
# 1. Générer le secret
SECRET=$(openssl rand -hex 32)
echo "Ton secret : $SECRET"

# 2. Utilise cette valeur dans Railway et Supabase
```

**Dans Railway** :
```
N8N_API_KEY = a7f3b8c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9
```

**Dans Supabase** :
```
N8N_METRICS_API_KEY = a7f3b8c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9
```

**⚠️ MÊME VALEUR dans les deux !**






