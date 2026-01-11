import fs from 'fs';
import path from 'path';

// Define paths
const DATA_DIR = 'c:/Users/Kiswa/Documents/jan2026/kiswastore/crm-data';
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');

// Types
export interface Employee {
    id: string;
    companyId: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    whatsappVerified: boolean;
    lastContacted: string; // ISO Date
    engagementScore: number;
}

export interface Company {
    id: string;
    name: string;
    industry: string;
    location: {
        city: string;
        country: string;
    };
    dealValue: number;
    currency: string;
    status: 'Prospect' | 'MQL' | 'SQL' | 'Won' | 'Lost';
    pipelineStage: 'Lead' | 'MQL' | 'MAL' | 'SAL' | 'DealWon' | 'RepeatClient'; // More granular
    contacts: Employee[];
    lastActionDate: string;
    nextActionDate?: string;
    notes?: string;
}

export interface OutreachTemplate {
    id: string;
    name: string;
    channel: 'Email' | 'WhatsApp';
    subject?: string;
    content: string;
}

// Helpers
async function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
}

async function readFile<T>(filePath: string, defaultData: T): Promise<T> {
    await ensureDir();
    if (!fs.existsSync(filePath)) {
        await fs.promises.writeFile(filePath, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

async function writeFile<T>(filePath: string, data: T): Promise<void> {
    await ensureDir();
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}

// CRUD Operations
export async function getCompanies(): Promise<Company[]> {
    return readFile<Company[]>(COMPANIES_FILE, []);
}

export async function saveCompany(company: Company): Promise<Company> {
    const companies = await getCompanies();
    const index = companies.findIndex(c => c.id === company.id);
    if (index >= 0) {
        companies[index] = company;
    } else {
        companies.push(company);
    }
    await writeFile(COMPANIES_FILE, companies);
    return company;
}

export async function getTemplates(): Promise<OutreachTemplate[]> {
    return readFile<OutreachTemplate[]>(TEMPLATES_FILE, [
        {
            id: '1',
            name: 'Introductory Email',
            channel: 'Email',
            subject: 'Partnership Opportunity with Kiswa',
            content: 'Dear {{name}},\n\nI hope this email finds you well. I represent Kiswa, a luxury brand specializing in...'
        },
        {
            id: '2',
            name: 'WhatsApp Follow-up',
            channel: 'WhatsApp',
            content: 'Hi {{name}}, just checking in regarding our proposal for {{company}}.'
        }
    ]);
}
