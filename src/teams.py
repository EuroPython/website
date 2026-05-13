"""Team data – placeholder based on EuroPython 2025."""

from dataclasses import dataclass, field


@dataclass
class Team:
    name: str
    members: list[str] = field(default_factory=list)


TEAMS: list[Team] = [
    Team(
        "EuroPython Society Board",
        [
            "Artur Czepiel (Chair)",
            "Mia Bajić (Vice Chair)",
            "Anders Hammarquist",
            "Aris Nivorils",
            "Cyril Bitterich",
            "Ege Akman",
            "Shekhar Koirala",
        ],
    ),
    Team(
        "Programme",
        [
            "Jodie Burchell",
            "Cristián Maureira-Fredes",
            "Diego Russo",
            "Marina Moro",
            "Naa Ashiorkor Nortey",
            "Rodrigo Girão Serrão",
            "Yuliia Barabash",
        ],
    ),
    Team(
        "Communications & Design",
        [
            "Mia Bajić",
            "Tim Hobbs",
            "Martina Zátopková",
            "Adriana Sánchez",
            "Cristián Maureira-Fredes",
            "Daksh P. Jain",
            "Raquel Dou",
            "Marcin Wierzbanowski",
            "Artur Czepiel",
            "Ege Akman",
        ],
    ),
    Team(
        "Sponsorship",
        [
            "Anežka Müller",
            "Artur Czepiel",
            "Iryna Kondrashchenko",
            "Jake Balaš",
            "Konstantin Ignatov",
            "Kshitijaa Jaglan",
            "Marcin Wierzbanowski",
            "Mia Bajić",
            "Oleh Kostromin",
            "Raquel Dou",
        ],
    ),
    Team(
        "Financial Aid",
        [
            "Vicky Twomey-Lee",
            "Doreen Peace Nangira Wanyama",
            "Koti Vellanki",
            "Shekhar Koirala",
            "Artur Czepiel",
        ],
    ),
    Team(
        "Operations",
        [
            "Aneta Popelová",
            "Anežka Müller",
            "Aris Nivorlis",
            "George Margaritis",
            "George Zisopoulos",
            "Jakub Červinka",
            "Jake Balaš",
            "John Robert",
            "Kateřina Vaňková",
            "Liberta Gani",
            "Mahe Iram Khan",
            "Martin Borus",
            "Moisés Guimarães",
            "Niklas Mertsch",
            "Piotr Gnus",
            "Saurav Pandey",
            "Simon Peter Dagbui",
        ],
    ),
    Team(
        "Speaker Mentorship",
        [
            "Naa Ashiorkor Nortey",
            "Joana Owusu-Appiah",
            "Theofanis Petkos",
        ],
    ),
    Team(
        "Accessibility",
        [
            "Alan Dublaouch",
            "Konstantin Ignatov",
            "Niklas Mertsch",
            "Jake Balaš",
            "Cristián Maureira-Fredes",
            "Raquel Dou",
            "Daniel Clauser",
            "Vega Čerkassova",
            "Aleksandr Salynskii",
            "Evgeniya Volkova",
        ],
    ),
    Team(
        "Code of Conduct",
        [
            "Cheuk Ting Ho",
            "Georgi Ker",
            "Jakub Vysoky",
            "Lumír Balhar",
            "Vicky Twomey-Lee",
        ],
    ),
    Team(
        "Community Organisers",
        [
            "Maria José Molina",
            "Theofanis Petkos",
            "Cristián Maureira-Fredes",
            "Vassiliki Dalakiari",
        ],
    ),
    Team(
        "A/V Coordinators",
        [
            "Raquel Dou",
            "Piotr Gnus",
            "Anežka Müller",
        ],
    ),
    Team("Sprints", ["Rodrigo Girão Serrão"]),
    Team("Discord", ["Niklas Mertsch"]),
    Team("Django Girls", ["Doreen Peace Nangira Wanyama"]),
    Team(
        "Humble Data",
        [
            "Cheuk Ting Ho",
            "Jodie Burchell",
            "Martin Borus",
            "Sena Şahin",
        ],
    ),
    Team("Unconference Day", ["Daria Grudzien Linhart", "Honza Javorek"]),
    Team("PyLadies Events", ["Maria José Molina"]),
    Team("Childcare", ["Boris Kolda"]),
]
