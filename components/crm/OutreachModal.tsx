"use client";

import { useState, useEffect } from 'react';
import { Company, Employee, OutreachTemplate } from '@/lib/crm-storage';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2 } from "lucide-react";

interface OutreachModalProps {
    company: Company;
    isOpen: boolean;
    onClose: () => void;
}

export function OutreachModal({ company, isOpen, onClose }: OutreachModalProps) {
    const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [messageContent, setMessageContent] = useState('');
    const [selectedContact, setSelectedContact] = useState<string>(company.contacts[0]?.id || '');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        // Load Templates
        // In a real app we'd fetch from API, for now using mocked or passed prop approach if we had one
        // But since we didn't expose templates via API yet, let's mock for UI speed or add API later
        const mockTemplates: OutreachTemplate[] = [
            {
                id: '1',
                name: 'Intro - Hospitality',
                channel: 'Email',
                subject: 'Partnership with Kiswa',
                content: 'Dear {{name}},\n\nWe at Kiswa admire {{company}} reputation in hospitality...'
            },
            {
                id: '2',
                name: 'WhatsApp Follow-up',
                channel: 'WhatsApp',
                content: 'Hi {{name}}, checking in on our proposal for {{company}}.'
            }
        ];
        setTemplates(mockTemplates);
    }, []);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find(t => t.id === templateId);
        if (template) {
            const contact = company.contacts.find(c => c.id === selectedContact) || company.contacts[0];
            let content = template.content
                .replace('{{name}}', contact?.name || 'Partner')
                .replace('{{company}}', company.name);
            setMessageContent(content);
        }
    };

    const handleSend = async () => {
        setSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSending(false);
        setSent(true);
        setTimeout(() => {
            setSent(false);
            onClose();
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Outreach</DialogTitle>
                </DialogHeader>

                {!sent ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Recipient</Label>
                                <Select value={selectedContact} onValueChange={setSelectedContact}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select contact" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {company.contacts.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                        {company.contacts.length === 0 && <SelectItem value="none" disabled>No contacts</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Template</Label>
                                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name} ({t.channel})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Message Preview</Label>
                            <Textarea
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                className="h-32 font-mono text-sm"
                                placeholder="Select a template or type your message..."
                            />
                        </div>
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in duration-300">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold">Sent Successfully</h3>
                        <p className="text-sm text-gray-500">Engagement tracking enabled.</p>
                    </div>
                )}

                {!sent && (
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSend} disabled={sending || !selectedContact || !messageContent} className="bg-black text-white hover:bg-gray-800 gap-2">
                            {sending ? "Sending..." : (
                                <>
                                    <Send className="w-4 h-4" /> Send
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
