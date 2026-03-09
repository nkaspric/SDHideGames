import os
import json
import logging

# Configuration du logging pour voir les erreurs dans /tmp/decky_ui.log
logging.basicConfig(
    filename="/tmp/sd_hide_games.log", 
    format='%(asctime)s %(levelname)s %(message)s', 
    level=logging.INFO
)

class Plugin:
    def __init__(self):
        # Utilise le répertoire officiel de Decky pour la persistance
        self.settings_dir = os.environ.get("DECKY_PLUGIN_SETTINGS_DIR", "/tmp")
        self.settings_path = os.path.join(self.settings_dir, "settings.json")
        self.settings = self._load_settings()
        logging.info("SDHideGames: Initialisation du backend")

    def _load_settings(self):
        """Charge les paramètres depuis le fichier JSON s'il existe."""
        try:
            if os.path.exists(self.settings_path):
                with open(self.settings_path, "r") as f:
                    data = json.load(f)
                    logging.info(f"SDHideGames: Paramètres chargés: {data}")
                    return data
            return {"hider": False} # Valeur par défaut
        except Exception as e:
            logging.error(f"SDHideGames: Erreur lors du chargement: {e}")
            return {"hider": False}

    async def get_settings(self):
        """Retourne les réglages actuels au Frontend."""
        try:
            logging.info(f"SDHideGames: settings obtenus: {self.settings}")
            return {"success": True, "result": self.settings}
        except Exception as e:
            logging.error(f"SDHideGames: Erreur dans get_settings: {e}")
            return {"success": False, "error": str(e)}

    async def set_settings(self, hider: bool):
        """Sauvegarde l'état du toggle envoyé par le Frontend."""
        try:
            self.settings["hider"] = hider
            # Création du dossier de config s'il n'existe pas
            os.makedirs(self.settings_dir, exist_ok=True)
            
            with open(self.settings_path, "w") as f:
                json.dump(self.settings, f)
            
            logging.info(f"SDHideGames: Nouvel état sauvegardé: hider={hider}")
            return {"success": True}
        except Exception as e:
            logging.error(f"SDHideGames: Erreur dans set_settings: {e}")
            return {"success": False, "error": str(e)}

    async def get_installed_appids(self):
            # Chemins des jeux installés
            paths = ["/home/deck/.local/share/Steam/steamapps/", "/run/media/mmcblk0p1/steamapps/"]
            installed_ids = []
            for path in paths:
                if os.path.exists(path):
                    for f in os.listdir(path):
                        if f.startswith("appmanifest_"):
                            # Extraction de l'ID à partir du nom de fichier
                            appid = f.replace("appmanifest_", "").replace(".acf", "")
                            installed_ids.append(appid)

            logging.info(f"SDHideGames: generate game list : {installed_ids}")
            return installed_ids

    async def _main(self):
        """Méthode appelée au démarrage du plugin par Decky."""
        logging.info("SDHideGames: Plugin démarré avec succès")

    async def _unload(self):
        """Méthode appelée à la fermeture ou mise à jour du plugin."""
        logging.info("SDHideGames: Plugin déchargé")