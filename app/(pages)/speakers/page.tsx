import { Fragment } from "react";
import { Separator } from "components/separator/separator";
import { Title } from "components/typography/title";
import { fetchSpeakersWithConfirmedSubmissions } from "@/lib/pretalx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speakers",
};

export default async function SpeakersPage() {
  const speakers = await fetchSpeakersWithConfirmedSubmissions();

  // group speakers by starting letter
  const groups = speakers
    .filter((speaker) => !!speaker.name)
    .reduce((acc, speaker) => {
      const letter = speaker.name[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(speaker);
      return acc;
    }, {} as { [key: string]: typeof speakers });

  const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Title>Speakers</Title>

      <div className="flex text-3xl font-bold flex-wrap">
        {letters.map((letter) => (
          <Title level={3} key={letter} className="mr-2">
            <a href={`#letter-${letter}`}>{letter}</a>
          </Title>
        ))}
      </div>

      {letters.map((letter, index) => (
        <Fragment key={letter}>
          <div id={`letter-${letter}`}>
            <Title level={2}>{letter}</Title>

            <ul className="pl-4">
              {groups[letter]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((speaker) => (
                  <li key={speaker.code} className="mb-1">
                    <a
                      className="underline hover:text-primary-hover"
                      href={`/speaker/${speaker.slug}`}
                    >
                      {speaker.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {index !== Object.keys(groups).length - 1 && <Separator />}
        </Fragment>
      ))}

      <div className="h-12"></div>
    </>
  );
}
