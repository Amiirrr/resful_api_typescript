import { Contact } from "@prisma/client";

export interface BaseContact {
    first_name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
}

export interface CreateContactRequest extends BaseContact { }

export interface ContactResponse extends BaseContact {
    id: number;
}

export interface UpdateContactRequest extends BaseContact {
    id: number;
}

export type SearchContactRequest = {
    name?: string;
    phone?: string;
    email?: string;
    page: number;
    size: number;
}

export function toContactResponse(contact: Contact): ContactResponse {
    return {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone
    }
}
