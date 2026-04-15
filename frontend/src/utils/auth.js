export const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export const setUserRole = (role) => {
  localStorage.setItem("userRole", role);
};

export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

export const removeUserRole = () => {
  localStorage.removeItem("userRole");
};

// --- User Info ---
export const setUserInfo = (info) => {
  localStorage.setItem("userInfo", JSON.stringify(info));
};

export const getUserInfo = () => {
  const raw = localStorage.getItem("userInfo");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
};

export const updateUserInfo = (updates) => {
  const current = getUserInfo() || {};
  const updated = { ...current, ...updates };
  setUserInfo(updated);
  return updated;
};

// --- Enterprise Setup (first-login flow) ---
export const setSetupComplete = () => {
  localStorage.setItem("sf_setup_complete", "true");
};

export const isSetupComplete = () => {
  return localStorage.getItem("sf_setup_complete") === "true";
};

export const clearSetupComplete = () => {
  localStorage.removeItem("sf_setup_complete");
};

export const clearAuth = () => {
  removeToken();
  removeUserRole();
  localStorage.removeItem("userInfo");
  localStorage.removeItem("refreshToken");
  // Note: we don't clear setup on logout so it persists across logins
};

// --- User Registry (simulated backend) ---
const USERS_KEY = "sf_registered_users";

export const getRegisteredUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Register a new user in localStorage.
 * Returns { success: true, user } or { success: false, error }.
 */
export const registerUser = ({
  username,
  email,
  password,
  role,
  enterpriseCode,
}) => {
  const users = getRegisteredUsers();
  // Check for duplicate username
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: "Ce nom d'utilisateur est déjà pris." };
  }
  // Check for duplicate email
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Cet email est déjà utilisé." };
  }
  const newUser = {
    id: `user-${Date.now()}`,
    username,
    email,
    password, // In production this would be hashed
    role,
    enterpriseCode: enterpriseCode || null,
    dateJoined: new Date().toISOString().split("T")[0],
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, user: newUser };
};

/**
 * Find a user by username and password.
 * Returns the user object or null.
 */
export const findUser = (username, password) => {
  const users = getRegisteredUsers();
  return (
    users.find(
      (u) =>
        (u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === username.toLowerCase()) &&
        u.password === password,
    ) || null
  );
};
