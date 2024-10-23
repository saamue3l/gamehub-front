<template>
  <base-page title="Filtres">
    <div class="container mx-auto">
      <!-- Encadré de Filtre -->
      <div class="border border-custom-white rounded-lg p-4 mb-4">
        <div class="flex gap-4">
          <!-- Section des jeux sélectionnés -->
          <div
            v-for="(game, index) in selectedGames"
            :key="index"
            class="relative border border-gray-300 rounded-lg p-2 flex flex-col items-center"
          >
            <!-- Image du jeu -->
            <img src="@/assets/lolCover.png" alt="Game Image" class="w-16 h-24" />

            <!-- Informations du jeu (Nom, Niveau, Plateforme) sous l'image -->
            <div class="flex flex-col items-center mt-2">
              <p class="text-custom-white text-sm font-medium py-1">
                {{ game.name }}
              </p>
              <p class="text-custom-white text-xs font-light py-0.5 px-2 bg-custom-secondary rounded-3xl inline-block">
                {{ game.levelLabel }}
              </p>
              <p class="text-custom-white text-xs font-light py-0.5 px-2 bg-custom-secondary rounded-3xl inline-block mt-1">
                {{ game.platformLabel }}
              </p>
            </div>

            <!-- Bouton "croix" pour retirer le jeu -->
            <button
              @click="removeGame(index)"
              class="absolute -top-3 -right-3 text-white text-lg cursor-pointer bg-red-500 rounded-full w-6 h-6 flex justify-center items-center"
            >
              &times;
            </button>
          </div>

          <!-- Bouton "+" pour ajouter un jeu -->
          <!-- Bouton "+" pour ajouter un jeu -->
          <button
            class="border border-gray-300 w-16 h-24 flex justify-center items-center text-2xl text-gray-500"
            @click="openModal"
          >
            +
          </button>

        </div>
      </div>

      <!-- Encadré de Résultats (Vide pour l'instant) -->
      <div class="border border-custom-white rounded-lg p-4">
        <p>Résultats ici...</p>
      </div>

      <!-- Modal pour ajouter un jeu -->
      <AddGameFilterMatchmakingModal
        v-if="isModalVisible"
        @close="closeModal"
        @add-game="addGame"
      />
    </div>
  </base-page>
</template>


<script>
import AddGameFilterMatchmakingModal from '@/components/matchmaking/AddFilterMatchmakingModal.vue'
import BasePage from '@/components/layout/BasePage.vue' // Import du modal

export default {
  name: 'Matchmaking',
  components: {
    BasePage,
    AddGameFilterMatchmakingModal
  },
  data() {
    return {
      isModalVisible: false, // Gérer l'affichage du modal
      selectedGames: [], // Liste des jeux sélectionnés
      platforms: [ // Définir les plateformes
        { id: 1, name: 'PC' },
        { id: 2, name: 'PlayStation' },
        { id: 3, name: 'Xbox' }
      ]
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
    },
    addGame(gameData) {
      // Rechercher le nom de la plateforme à partir de l'ID sélectionné
      const selectedPlatform = this.platforms.find(platform => platform.id === gameData.platform);

      // Ajoute un jeu à la liste des jeux sélectionnés
      this.selectedGames.push({
        ...gameData,
        imageUrl: '@/assets/lolCover.png', // Image de test pour chaque jeu ajouté
        levelLabel:
          gameData.level === '1' ? 'Débutant' :
            gameData.level === '2' ? 'Intermédiaire' :
              'Avancé', // Affiche le libellé correct pour le niveau
        platformLabel: selectedPlatform ? selectedPlatform.name : '', // Affiche le nom de la plateforme
      });
    },
    removeGame(index) {
      // Retire le jeu de la liste des jeux sélectionnés
      this.selectedGames.splice(index, 1)
    }
  }
}
</script>
