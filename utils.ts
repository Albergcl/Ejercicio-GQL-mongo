import { Flight, FlightModel } from "./types.ts";

export const fromModelToFlight = (flight: FlightModel): Flight => {
    return {
        id: flight._id!.toString(),
        origen: flight.origen,
        destino: flight.destino,
        fechaHora: flight.fechaHora
    }
}