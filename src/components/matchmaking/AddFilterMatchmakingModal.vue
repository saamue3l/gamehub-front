<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          <h2>Ajouter un jeu</h2>
        </slot>
        <button
          type="button"
          class="btn-close"
          @click="close"
        >
          x
        </button>
      </header>

      <section class="modal-body">
        <!-- Zone de texte pour entrer un jeu -->
        <div>
          <label for="game-name">Nom du jeu</label>
          <input
            id="game-name"
            type="text"
            v-model="searchQuery"
            @input="onSearchInput"
            class="border p-2 w-full"
            placeholder="Tapez le nom d'un jeu (3 caractères minimum)"
          />

          <!-- Liste des résultats d'autocomplétion (simulée) -->
          <ul v-if="autocompleteGames.length">
            <li
              v-for="game in autocompleteGames"
              :key="game.id"
              @click="selectGame(game)"
              class="cursor-pointer hover:bg-gray-200 p-2"
            >
              {{ game.name }}
            </li>
          </ul>
        </div>

        <!-- Sélection d'une plateforme -->
        <div class="mt-4">
          <label for="platform">Plateforme</label>
          <select v-model="selectedPlatform" id="platform" class="border p-2 w-full">
            <option value="" disabled selected>Choisir une plateforme</option>
            <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
              {{ platform.name }}
            </option>
          </select>
        </div>

        <!-- Sélection d'un niveau -->
        <div class="mt-4">
          <label for="level">Niveau</label>
          <select v-model="selectedLevel" id="level" class="border p-2 w-full">
            <option value="" disabled selected>Choisir un niveau</option>
            <option value="1">Débutant</option>
            <option value="2">Intermédiaire</option>
            <option value="3">Avancé</option>
          </select>
        </div>
      </section>

      <footer class="modal-footer">
        <slot name="footer">
          <button
            type="button"
            class="btn"
            @click="close"
          >
            Annuler
          </button>
          <button
            type="button"
            class="btn btn-green"
            @click="addGame"
          >
            Ajouter
          </button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddGameFilterMatchmakingModal',
  data() {
    return {
      searchQuery: '',
      autocompleteGames: [], // Simulé, à remplacer par des résultats d'API
      selectedPlatform: '',
      selectedLevel: '',
      platforms: [
        { id: 1, name: 'PC' }, // Simulé, à remplacer par des données API
        { id: 2, name: 'PlayStation' },
        { id: 3, name: 'Xbox' },
      ], // Plateformes simulées
    };
  },
  methods: {
    close() {
      this.$emit('close'); // Émet l'événement de fermeture
    },
    onSearchInput() {
      if (this.searchQuery.length >= 3) {
        // Simule un appel API pour l'autocomplétion
        this.autocompleteGames = [
          { id: 1, name: 'League of Legends' },
          { id: 2, name: 'Valorant' },
        ]; // Remplacer par la requête API pour chercher des jeux
      } else {
        this.autocompleteGames = [];
      }
    },
    selectGame(game) {
      this.searchQuery = game.name;
      this.autocompleteGames = []; // Réinitialise la liste après sélection
    },
    addGame() {
      // Simule l'ajout du jeu sélectionné
      if (this.searchQuery && this.selectedPlatform && this.selectedLevel) {
        const gameData = {
          name: this.searchQuery,
          platform: this.selectedPlatform,
          level: this.selectedLevel,
        };
        this.$emit('add-game', gameData); // Émet un événement avec les données du jeu ajouté
        this.close(); // Ferme le modal
      } else {
        alert('Veuillez remplir tous les champs avant d\'ajouter un jeu.');
      }
    }
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 10px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn {
  background-color: #ccc;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-green {
  background-color: #4CAF50;
  color: white;
}

.btn:hover,
.btn-green:hover {
  background-color: #45a049;
}
</style>
