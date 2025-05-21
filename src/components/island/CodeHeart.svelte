<script>
  import { onMount } from 'svelte';

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

{#if !mini}
  <div class="code-heart">
    <button
      class="heart-button"
      on:click={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <i class={`fa-heart heart-icon ${isFavorite ? 'fas filled' : 'far'}`}></i>
    </button>
  </div>
{:else}
  <div class="code-heart">
    {#if isFavorite}
      <i class="fas fa-heart heart-icon filled"></i>
    {/if}
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
    font-size: 24px;
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
