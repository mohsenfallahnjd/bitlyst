// Generate a random anonymous user ID
export function generateUserId(): string {
  return `user_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
}

// Get or create user ID from localStorage
export function getUserId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    let userId = localStorage.getItem("anonymous-user-id");

    if (!userId) {
      userId = generateUserId();
      localStorage.setItem("anonymous-user-id", userId);
    }

    return userId;
  } catch (error) {
    console.warn("Failed to get/set user ID:", error);
    // Fallback to session-based ID
    return generateUserId();
  }
}
