/*
  Se pide crear una API GraphQL con persistencia de datos en Mongo para gestionar los vuelos de una compañía aerea.

  Los vuelos tienes tres campos:

  Origen
  Destino
  Fecha y hora, por ej. "22/11/23 12:45"
  Los tres datos son una cadena de texto.


  Las queries y mutaciones que debe ofrecer la API son:
    - getFlights, tiene los argumentos opcionales origen y destino. Si ambos argumentos están presentes devuelve todos los vuelos con dicho origen y destino, si solo un argumento está presente, por ejemplo el origen, devuelve todos los vuelos con ese origen, si ningún argumento está presente devuelve todos los vuelos (incluyendo sus ids).
    - getFlight, recibe como argumento obligatorio el id del vuelo, devuelve el vuelo con dicho id, y si no existe devuelve null.
    - addFlight, recibe como argumentos obligatorios el origen, destino y fecha-hora. Devuelve los datos del vuelo (incluyendo su id)
*/

import { MongoClient } from "mongodb";
import { FlightModel } from "./types.ts";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { gqlSchema } from "./schema.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("No se ha encontrado la varaible de entorno MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Conectado a MongoDB");

const mongoDB = mongoClient.db("flights");

const FlightsCollection = mongoDB.collection<FlightModel>("flights");

const server = new ApolloServer({
  typeDefs: gqlSchema,
  resolvers,
});

const { url } = await startStandaloneServer(server, { context: async () => ({ FlightsCollection })});

console.info(`Server ready at ${url}`);