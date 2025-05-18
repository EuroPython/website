<script>
  import { onMount } from 'svelte';

  // Component props
  export let mini = false;
  export let codeId = "";
  export let code = codeId;
  export let title = "";

  let isFavorite = false;

  const STORAGE_PREFIX = "codeheart_v1";

  function getStorageKey() {
    if (!codeId) {
      throw new Error("CodeHeart component requires a codeId prop");
    }
    return `${STORAGE_PREFIX}:${codeId}`;
  }

  function saveCode() {
    try {
      const item = {
        code,
        title,
        timestamp: new Date().toISOString(),
        version: 1 // For future compatibility
      };

      localStorage.setItem(getStorageKey(), JSON.stringify(item));

      dispatchEvent('save', { codeId, code, title });
    } catch (error) {
      console.error("Failed to save code:", error);
    }
  }

  function removeCode() {
    try {
      localStorage.removeItem(getStorageKey());

      dispatchEvent('remove', { codeId });
    } catch (error) {
      console.error("Failed to remove code:", error);
    }
  }

  function toggleFavorite() {
    isFavorite = !isFavorite;

    if (isFavorite) {
      saveCode();
    } else {
      removeCode();
    }
  }

  function dispatchEvent(action, detail) {
    const event = new CustomEvent('codeheartaction', {
      bubbles: true,
      detail: { action, ...detail }
    });

    document.dispatchEvent(event);
  }

  onMount(() => {
    try {
      const item = localStorage.getItem(getStorageKey());
      isFavorite = !!item;
    } catch (error) {
      console.error("Failed to check if code is saved:", error);
      isFavorite = false;
    }
  });
</script>

{#if !mini || isFavorite }
  <div class="code-heart">
    <button
      class="heart-button"
      on:click={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {#if isFavorite}
        <svg xmlns="http://www.w3.org/2000/svg" class="heart-icon filled" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="heart-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" stroke="currentColor" stroke-width="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
      {/if}
    </button>
  </div>
{/if}

<style>
  .code-heart {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .heart-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .heart-button:hover {
    transform: scale(1.1);
  }

  .heart-button:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    border-radius: 20px;
  }

  .heart-icon {
    width: 24px;
    height: 24px;
    color: #666;
    transition: color 0.2s ease;
  }

  .heart-icon.filled {
    color: #ff3e66;
  }

  .heart-button:hover .heart-icon:not(.filled) {
    color: #999;
  }
</style>
