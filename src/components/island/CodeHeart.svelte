<script>
  import { favorites } from "@stores/favorites.js";

  export let mini = false;
  export let codeId = '';
  export let code = codeId;
  export let title = '';

  let isFavorite = false;

  favorites.subscribe($favorites => {
    isFavorite = !!$favorites[codeId];
  });

  function toggleFavorite() {
    const current = favorites.get();
    if (current[codeId]) {
      const { [codeId]: _, ...rest } = current;
      favorites.set(rest);
    } else {
      favorites.set({
        ...current,
        [codeId]: { code, title }
      });
    }
  }
</script>

{#if !mini}
  <button
    class="code-heart inline-flex items-center p-1 text-gray-500 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:rounded-full"
    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    on:click={toggleFavorite}
  >
    <i
      class={`fa-heart text-lg transition-colors duration-200 ${
        isFavorite ? 'fas text-red-500' : 'far text-gray-500 hover:text-gray-700'
      }`}
    ></i>
  </button>
{:else if isFavorite}
  <div class="flex justify-center">❤️</div>
{/if}
