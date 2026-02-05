import { extractRecipeData } from "../utils/schemaParser";

function sendRecipe() {
  const recipe = extractRecipeData(window.location.href);
  if (!recipe) return;

  chrome.runtime.sendMessage({ type: "PANTRY_MATCH_RECIPE", payload: recipe });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", sendRecipe);
} else {
  sendRecipe();
}

const observer = new MutationObserver(() => {
  sendRecipe();
});

observer.observe(document.documentElement, { childList: true, subtree: true });
