import { Collection, ObjectId } from "mongodb";
import { Flight, FlightModel } from "./types.ts";
import { fromModelToFlight } from "./utils.ts";

export const resolvers = {
    Query: {
        getFlights: async (_: unknown, args: { origen?: string, destino?: string }, context: { FlightsCollection: Collection<FlightModel> }): Promise<Flight[]> => {
            if(args.origen && args.destino){
                const flights = await context.FlightsCollection.find({ origen: args.origen, destino: args.destino }).toArray();
                return flights.map(flights => fromModelToFlight(flights));

            }else if(args.origen){
                const flights = await context.FlightsCollection.find({ origen: args.origen }).toArray();
                return flights.map(flights => fromModelToFlight(flights));

            }else if(args.destino){
                const flights = await context.FlightsCollection.find({ destino: args.destino }).toArray();
                return flights.map(flights => fromModelToFlight(flights));
                
            }else{
                const flights = await context.FlightsCollection.find().toArray();
                return flights.map(flights => fromModelToFlight(flights));
            }
        },

        getFlight: async (_: unknown, { id }: { id: string }, context: { FlightsCollection: Collection<FlightModel> }): Promise<Flight | null> => {
            const flight = await context.FlightsCollection.findOne({ _id: new ObjectId(id) });

            if(!flight){
                return null;
            }

            return fromModelToFlight(flight);
        }
    },

    Mutation: {
        addFligth: async (_: unknown, args: { origen: string, destino: string, fechaHora: string }, context: { FlightsCollection: Collection<FlightModel> }): Promise<Flight> => {
            const { origen, destino, fechaHora } = args;
            const { insertedId } = await context.FlightsCollection.insertOne({ 
                origen, 
                destino, 
                fechaHora 
            });

            const flight = {
                _id: insertedId,
                origen,
                destino,
                fechaHora
            };

            return fromModelToFlight(flight);
        }
    }
}