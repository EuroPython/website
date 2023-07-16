export function runSessionHacks<T>(
  session: T & {
    title: string;
    href: string;
    room: string;
    style: { gridColumnStart: number; gridColumnEnd: number };
  },
  rooms: string[]
) {
  if (session.title.toLocaleLowerCase().includes("poster session")) {
    session.style.gridColumnEnd += 1;
    session.href = "/posters";
  }

  if (session.title.toLocaleLowerCase().startsWith("registration")) {
    session.style.gridColumnStart = 2;
    session.style.gridColumnEnd = rooms.length + 2;
    session.room = "Registration";
  }

  return session;
}
