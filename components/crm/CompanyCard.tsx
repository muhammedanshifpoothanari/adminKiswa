"use client";

import { useState } from 'react';
import { Company } from '@/lib/crm-storage';
import { Building2, MapPin, Users, Mail, DollarSign, MessageSquarePlus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OutreachModal } from './OutreachModal';

export function CompanyCard({ company }: { company: Company }) {
    const [showOutreach, setShowOutreach] = useState(false);

    return (
        <>
            <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-none shadow-sm group relative">
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm line-clamp-1" title={company.name}>{company.name}</h4>
                        {company.status === 'SQL' && <Badge variant="default" className="text-[10px] h-5 bg-blue-500 hover:bg-blue-600">SQL</Badge>}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{company.location.city}, {company.location.country}</span>
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center text-xs font-medium">
                        <div className="flex items-center gap-1 text-green-600">
                            <DollarSign className="w-3 h-3" />
                            <span>{company.dealValue.toLocaleString()} {company.currency}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Users className="w-3 h-3" />
                            <span>{company.contacts.length}</span>
                        </div>
                    </div>

                    {company.lastActionDate && (
                        <div className="text-[10px] text-gray-400 pt-1 text-right">
                            Last Active: {new Date(company.lastActionDate).toLocaleDateString()}
                        </div>
                    )}

                    {/* Hover Action */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-black hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag start if possible, though dnd might handle differently
                                setShowOutreach(true);
                            }}
                        >
                            <MessageSquarePlus className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <OutreachModal
                company={company}
                isOpen={showOutreach}
                onClose={() => setShowOutreach(false)}
            />
        </>
    )
}
