import type { Recipe } from "../types";

let latestRecipe: Recipe | null = null;

chrome.runtime.onMessage.addListener(
  (
    message: { type?: string; payload?: unknown },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (message?.type === "PANTRY_MATCH_RECIPE") {
      latestRecipe = message.payload as Recipe;
      sendResponse({ status: "ok" });
      return true;
    }

    if (message?.type === "PANTRY_MATCH_GET_RECIPE") {
      sendResponse({ recipe: latestRecipe });
      return true;
    }

    return false;
  }
);

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (!tab.id) return;
  await chrome.sidePanel.open({ tabId: tab.id });
});
