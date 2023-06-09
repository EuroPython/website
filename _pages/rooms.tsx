import {
  DefinitionDescription,
  DefinitionList,
  DefinitionTerm,
} from "components/definition-list/definition-list";
import { Title } from "components/typography/title";
import { Layout } from "../components/layout";

export default function SessionsPage({}) {
  return (
    <Layout
      title="Rooms - EuroPython 2022 | July 11th-17th 2022 | Dublin Ireland & Remote"
      path="/rooms"
    >
      <main id="main-content" className="px-6">
        <Title>Rooms</Title>
        <Title level={2}>Monday July 11th</Title>
        <DefinitionList>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ground-foyer">
              Ground Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Registration</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-1">
              Wicklow Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Main Workshop 1</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2A
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Main Workshop 2</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2B
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Main Workshop 3</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-1">
              Liffey Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>
            Django Girls (separate registraion)
          </DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-2">
              Liffey Hall 2
            </a>
          </DefinitionTerm>
          <DefinitionDescription>
            Pew Pew Workshop (Open to Conference-only tickets holders)
          </DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-1-foyer">
              Level 1
            </a>{" "}
            &{" "}
            <a className="underline text-primary" href="/room/level-2-foyer">
              2 Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Tea &amp; Coffee</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-3-foyer">
              Level 3 Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Lunch</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ecocem">
              Ecocem
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Childcare</DefinitionDescription>
        </DefinitionList>

        <Title level={2}>Tuesday July 12th</Title>
        <DefinitionList>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ground-foyer">
              Ground Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Registration</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-1">
              Wicklow Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Main Workshop 1</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2A
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Main Workshop 2</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2B
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Main Workshop 3</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-1">
              Liffey Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Trans*Code Workshop</DefinitionDescription>

          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-2">
              Liffey Hall 2
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Sponsored Workshops</DefinitionDescription>
          <DefinitionTerm>
            <a
              className="underline text-primary"
              href="/room/liffey-meeting-room-2"
            >
              Liffey Meeting Room 2
            </a>
          </DefinitionTerm>

          <DefinitionDescription>
            Beginners' Day - Humble Data (Open to Conference Only Ticket
            Holders)
          </DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-1-foyer">
              Level 1
            </a>{" "}
            &{" "}
            <a className="underline text-primary" href="/room/level-2-foyer">
              2 Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Tea &amp; Coffee</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-3-foyer">
              Level 3 Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Lunch</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ecocem">
              Ecocem
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Childcare</DefinitionDescription>
        </DefinitionList>

        <Title level={2}>Wednesday July 13th to Friday 15th</Title>

        <DefinitionList>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ground-foyer">
              Ground Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Registration</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/auditorium">
              The Auditorium
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Conference Room 1</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-1">
              Wicklow Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Conference Room 2</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-a">
              Liffey A
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Conference Room 3</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-b">
              Liffey B
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Conference Room 4</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-1">
              Liffey Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Conference Room 5</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-2">
              Liffey Hall 2
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Conference Room 6</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2A
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Open Space</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2B
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Quiet Room</DefinitionDescription>
          <DefinitionTerm>
            <a
              className="underline text-primary"
              href="/room/liffey-boardroom-3"
            >
              Liffey Boardroom 3
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Speaker Ready Room</DefinitionDescription>
          <DefinitionTerm>
            <a
              className="underline text-primary"
              href="/room/liffey-boardroom-4"
            >
              Liffey Boardroom 4
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Speaker Breakout Room</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              Forum
            </a>
          </DefinitionTerm>
          <DefinitionDescription>
            Team &amp; Coffee - Lunch
          </DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-5-foyer">
              Level 5 Foyer
            </a>{" "}
            (only thursday)
          </DefinitionTerm>
          <DefinitionDescription>VIP Lunch - Organisers</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-5-foyer">
              Level 5 Foyer
            </a>{" "}
            (only friday)
          </DefinitionTerm>
          <DefinitionDescription>VIP Lunch - PyLadies</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ecocem">
              Ecocem
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Childcare</DefinitionDescription>

          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum - Central
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Exhibit Area</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum - Far end
            </a>
          </DefinitionTerm>
          <DefinitionDescription>OSS Tables</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum - West
            </a>
          </DefinitionTerm>
          <DefinitionDescription>MakerFest</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum - East
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Working Area</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum - Entrance Wall{" "}
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Poster Boards</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum - Four Corners
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Food Area </DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/forum">
              The Forum Entrance Area
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Job Board</DefinitionDescription>
        </DefinitionList>

        <Title level={2}>
          Saturday July 16th to Sunday July 17th (sprints)
        </Title>

        <DefinitionList>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-1">
              Liffey Hall 1
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Sprint Room 1</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/liffey-hall-2">
              Liffey Hall 2
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Sprint Room 2</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2A
            </a>{" "}
            +{" "}
            <a className="underline text-primary" href="/room/wicklow-hall-2">
              Wicklow Hall 2B
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Sprint Room 3</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/level-1-foyer">
              Level 1
            </a>{" "}
            &{" "}
            <a className="underline text-primary" href="/room/level-2-foyer">
              2 Foyer
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Tea &amp; Coffee</DefinitionDescription>
          <DefinitionTerm>
            <a className="underline text-primary" href="/room/ecocem">
              Ecocem
            </a>
          </DefinitionTerm>
          <DefinitionDescription>Childcare</DefinitionDescription>
        </DefinitionList>
      </main>
    </Layout>
  );
}
