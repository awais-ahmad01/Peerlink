// utils/userId.js
export function getUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 9); // simple random id
    localStorage.setItem("userId", userId);
  }
  return userId;
}
