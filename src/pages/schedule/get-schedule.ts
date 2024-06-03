//
// schedule: {
//   rows: {
//     type: "session" | "break";
//     title: string;
//     time: Date;
//     style: {
//       gridRowStart: number;
//       gridRowEnd: number;
//     };
//     sessions: {
//       title: string;
//       start: Date;
//       end: Date;
//       room: string;
//       href: string;
//       speakers: {
//         name: string;
//         slug: string;
//       }[];
//       customRoom?: string;
//       style: {
//         gridColumnStart: number;
//         gridColumnEnd: number;
//       };
//       code: string;
//       type: string;
//     }[];
//   }[];
//   rooms: string[];
// };

export const getSchedule = async () => {
  return {
    rows: [
      {
        type: "session",

        title: "Session 1",
        time: new Date(),
        style: {
          gridRowStart: 1,
          gridRowEnd: 2,
        },
        sessions: [
          {
            title: "Session 1",
            start: new Date(),
            end: new Date(),
            room: "Room 1",
            href: "/session-1",
            speakers: [
              {
                name: "Speaker 1",
                slug: "speaker-1",
              },
            ],
            style: {
              gridColumnStart: 1,
              gridColumnEnd: 2,
            },
            code: "S1",
            type: "session",
          },
        ],
      },

      {
        type: "break",
        title: "Break",
        time: new Date(),
        style: {
          gridRowStart: 1,
          gridRowEnd: 2,
        },
      },
    ],
    rooms: ["Room 1", "Room 2"],
  };
};
