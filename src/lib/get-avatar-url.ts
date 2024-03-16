export function getAvatarUrl(avatar: string): string;
export function getAvatarUrl(avatar: null): null;

export function getAvatarUrl(avatar: string | null) {
  if (!avatar) {
    return null;
  }

  if (avatar.startsWith("https://www.gravatar.com/avatar/")) {
    return `${avatar}?s=600`;
  }

  return avatar;
}
