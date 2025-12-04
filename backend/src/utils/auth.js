export const isOrganizer = (user) => {
  return user && (user.role === 'organizer' || user.role === 'admin');
};

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

export const isParticipant = (user) => {
  return user && user.role === 'participant';
};

export const isOwnerOrAdmin = (user, resourceOrganizerId) => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return user.id === resourceOrganizerId;
};
