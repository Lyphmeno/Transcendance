# <p align="center">ft_transcendence</p>

> _Ce projet est quelque chose que vous n’avez jamais fait auparavant._
>
> _Rappelez-vous du début de votre voyage en programmation. Regardez-vous maintenant. Il est temps de briller !_

## Preview

![](./preview.gif)

> L'image prend du temps à charger :)

## Checklist

- [x] Profil utilisateur
  - Connexion via l'API 42
  - 2FA
  - Gestion de compte
  - Liste d'amis
  - Historique des matchs
  - Achievements
- [x] Classement
- [x] Tchat
  - Messages directs
  - Canaux de discussion
- [x] Jeu
  - Matchmaking
  - Réactif
  - Mode spectateur
  - Plusieurs personnages
- [x] SQLi protected
- [x] No crash

## Usage `42stud only`

```bash
sudo apt update -y
sudo apt install -y make
sudo apt install -y unzip
sudo apt install -y docker.io
sudo apt install -y docker-compose
```

```bash
git clone https://github.com/ft_transcendence.git
cd ft_transcendence
```

- Recupère ta clé API 42
- Édite `backend/files/.env`:
  - FortyTwoClientID
  - FortyTwoSecret

```bash
unzip backend.zip
unzip frontend.zip
sudo make
# ça va prendre du temps
# ensuite -> http://localhost:8080
```
