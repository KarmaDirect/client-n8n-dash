# 🤝 Comment fonctionne notre collaboration Git/GitHub

## 🔍 Ce qui se passe réellement

Quand je fais des commits et des push, voici ce qui se passe :

### 1. **Je fais des commandes Git normales**

```bash
git add .
git commit -m "feat: description"
git push origin main
```

### 2. **Git utilise VOS credentials locaux**

- Les commits sont créés avec **VOTRE nom** et **VOTRE email** (configurés dans `git config`)
- Les push utilisent **VOS credentials** stockés dans le keychain macOS (`osxkeychain`)
- Je n'ai **aucun accès direct** à votre compte GitHub

### 3. **Preuve dans l'historique**

Tous les commits montrent :
```
Author: Yasmine Moro <yasminemoro@192.168.1.12>
```

C'est **VOTRE** nom et **VOTRE** email, pas les miens !

---

## 🔐 Comment ça fonctionne techniquement

### Configuration actuelle sur votre machine :

```bash
# Vos credentials Git
git config --global user.name "Yasmine Moro"
git config --global user.email "yasminemoro@192.168.1.12"

# Credential helper (stocke vos tokens GitHub)
git config --global credential.helper osxkeychain
```

### Quand je fais `git push` :

1. **Git demande les credentials** au système
2. **macOS Keychain** fournit automatiquement :
   - Votre nom d'utilisateur GitHub
   - Votre Personal Access Token (stocké précédemment)
3. **Git envoie le push** avec ces credentials
4. **GitHub accepte** car c'est votre token valide

---

## 🎯 Pourquoi ça fonctionne pour vous

Vous avez probablement déjà fait un push manuellement avant, et macOS a stocké vos credentials dans le keychain. Depuis, Git les réutilise automatiquement.

### Vérifier vos credentials stockés :

```bash
# macOS - Voir les credentials GitHub stockés
security find-internet-password -s github.com -w

# Voir la config Git
git config --global --list
```

---

## ❌ Pourquoi ça ne fonctionne pas pour votre ami

Votre ami n'a probablement pas :
1. ✅ Git configuré avec nom/email
2. ✅ Personal Access Token créé sur GitHub
3. ✅ Credentials stockés dans le système
4. ✅ Permissions sur le repository

---

## 🔧 Solution pour votre ami

### Option 1 : GitHub CLI (le plus simple)

```bash
# Installer GitHub CLI
brew install gh  # macOS
# ou
winget install GitHub.cli  # Windows

# Se connecter (ouvre le navigateur)
gh auth login

# Après ça, Git utilisera automatiquement ces credentials
git push
```

### Option 2 : Personal Access Token

1. Créer un token sur GitHub.com → Settings → Developer settings → Personal access tokens
2. Au premier push, entrer :
   - Username : son nom GitHub
   - Password : **le token** (pas le mot de passe !)
3. Le système stockera les credentials pour les prochaines fois

### Option 3 : SSH (plus sécurisé)

```bash
# Générer une clé SSH
ssh-keygen -t ed25519 -C "son.email@example.com"

# Copier la clé publique
cat ~/.ssh/id_ed25519.pub

# Ajouter sur GitHub → Settings → SSH keys

# Changer l'URL du remote
git remote set-url origin git@github.com:USERNAME/REPO.git
```

---

## 📊 Résumé

| Élément | Vous | Votre ami |
|---------|------|-----------|
| Git configuré | ✅ Oui | ❓ À vérifier |
| Token GitHub | ✅ Stocké | ❌ À créer |
| Credential helper | ✅ osxkeychain | ❓ À configurer |
| Permissions repo | ✅ Oui | ❓ À vérifier |

---

## 🎯 En résumé

**Je n'ai pas de super-pouvoir** - je fais juste des commandes Git normales qui utilisent **VOS credentials** stockés sur **VOTRE machine**.

C'est comme si vous faisiez les commandes vous-même, sauf que c'est moi qui les tape ! 😊

