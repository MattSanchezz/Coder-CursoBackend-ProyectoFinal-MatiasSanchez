import Ticket from "../dao/modelos/tickets.model.js";

function generateUniqueCode() {
    const uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    return uniqueCode;
}
//
async function addTicket(ticketData) {
    try {
        const ticket = new Ticket({
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: ticketData.amount,
            purchaser: ticketData.purchaser,
        });

        const savedTicket = await ticket.save();
        return savedTicket;
    } catch (error) {
        throw error;
    }
}

export { generateUniqueCode, addTicket };