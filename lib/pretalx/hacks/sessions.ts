export function runSessionHacks<T>(
  session: T & { title: string; href: string; style: { gridColumnEnd: number } }
) {
  if (session.title.toLocaleLowerCase().includes("poster session")) {
    session.style.gridColumnEnd += 1;
    session.href = "/posters";
  }

  return session;
}
