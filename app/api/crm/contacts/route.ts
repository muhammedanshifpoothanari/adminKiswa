import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

import Customer from "@/models/Customer";
import Subscriber from "@/models/Subscriber";

export async function GET() {
    try {
        await dbConnect();

        const [crmContacts, customers, subscribers] = await Promise.all([
            Contact.find({}).sort({ createdAt: -1 }).lean(),
            Customer.find({}).sort({ createdAt: -1 }).lean(),
            Subscriber.find({}).sort({ createdAt: -1 }).lean()
        ]);

        const formattedCustomers = customers.map((c: any) => ({
            _id: c._id,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone,
            company: 'Customer',
            role: 'Shopper',
            type: 'Client',
            status: 'Active',
            source: 'Store',
            createdAt: c.createdAt
        }));

        const formattedSubscribers = subscribers.map((s: any) => ({
            _id: s._id,
            firstName: 'Newsletter',
            lastName: 'Subscriber',
            email: s.email,
            phone: '',
            company: '',
            role: '',
            type: 'Lead',
            status: s.status === 'subscribed' ? 'Active' : 'Inactive',
            source: 'Newsletter',
            createdAt: s.createdAt
        }));

        const formattedCrmContacts = crmContacts.map((c: any) => ({
            ...c,
            source: 'CRM'
        }));

        const allContacts = [...formattedCrmContacts, ...formattedCustomers, ...formattedSubscribers]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(allContacts);
    } catch (error) {
        console.error("CRM Contacts Error:", error);
        return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const contact = await Contact.create(body);
        return NextResponse.json(contact, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
    }
}
