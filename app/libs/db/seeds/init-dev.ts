import { createAccount } from "~/libs/auth/create-account";
import { db } from "../db";

const characters = [
  {
    firstName: "Elizabeth",
    lastName: "Bennet",
    username: "elizabeth.bennet",
    email: "elizabeth.bennet@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Fitzwilliam",
    lastName: "Darcy",
    username: "fitzwilliam.darcy",
    email: "fitzwilliam.darcy@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Jay",
    lastName: "Gatsby",
    username: "jay.gatsby",
    email: "jay.gatsby@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Edmond",
    lastName: "Dantès",
    username: "edmond.dantes",
    email: "edmond.dantes@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Atticus",
    lastName: "Finch",
    username: "atticus.finch",
    email: "atticus.finch@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Jean",
    lastName: "Valjean",
    username: "jean.valjean",
    email: "jean.valjean@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Ishmael",
    lastName: "of Pequod",
    username: "ishmael.pequod",
    email: "ishmael.pequod@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Captain",
    lastName: "Ahab",
    username: "captain.ahab",
    email: "captain.ahab@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Natasha",
    lastName: "Rostova",
    username: "natasha.rostova",
    email: "natasha.rostova@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Don",
    lastName: "Quixote",
    username: "don.quixote",
    email: "don.quixote@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Sydney",
    lastName: "Carton",
    username: "sydney.carton",
    email: "sydney.carton@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Hester",
    lastName: "Prynne",
    username: "hester.prynne",
    email: "hester.prynne@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Jane",
    lastName: "Eyre",
    username: "jane.eyre",
    email: "jane.eyre@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Cosette",
    lastName: "Fauchelevent",
    username: "cosette.fauchelevent",
    email: "cosette.fauchelevent@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Ophelia",
    lastName: "of Denmark",
    username: "ophelia.denmark",
    email: "ophelia.denmark@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Juliet",
    lastName: "Capulet",
    username: "juliet.capulet",
    email: "juliet.capulet@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Romeo",
    lastName: "Montague",
    username: "romeo.montague",
    email: "romeo.montague@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Dorian",
    lastName: "Gray",
    username: "dorian.gray",
    email: "dorian.gray@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Anna",
    lastName: "Karenina",
    username: "anna.karenina",
    email: "anna.karenina@internal.local.dev",
    password: "internal99",
  },
  {
    firstName: "Beowulf",
    lastName: "of Geats",
    username: "beowulf.geats",
    email: "beowulf.geats@internal.local.dev",
    password: "internal99",
  },
];

export async function seed(database: typeof db) {
  console.log(`Seeding ${characters.length} user accounts...`);
  for (const account of characters) {
    console.log(
      `  -> Creating account for: ${account.firstName} ${account.lastName}`
    );
    await createAccount(
      {
        email: account.email,
        firstName: account.firstName,
        password: account.password,
        lastName: account.lastName,
        username: account.username,
      },
      {
        db: database,
      }
    );
  }
}

export async function should(database: typeof db) {
  // To prevent re-seeding, check if the first user in the list already exists.
  // If they do, we assume the seed has already run.
  if (!characters.length) {
    return false;
  }

  const firstUser = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, characters[0].username),
  });
  // Return 'true' to run the seed only if the first user does NOT exist.
  return !firstUser;
}
