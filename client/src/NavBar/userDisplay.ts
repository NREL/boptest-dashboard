export const getAvatarInitials = (name: string | undefined | null): string => {
  if (!name) {
    return '?';
  }
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].substring(0, 1).toUpperCase();
  }
  const first = parts[0].substring(0, 1).toUpperCase();
  const last = parts[parts.length - 1].substring(0, 1).toUpperCase();
  return `${first}${last}`;
};
