"use client";

import { useState } from 'react';
import { Company } from '@/lib/crm-storage';
import { CompanyCard } from './CompanyCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface KanbanBoardProps {
    initialCompanies: Company[];
}

const STAGES = ['Lead', 'MQL', 'MAL', 'SAL', 'DealWon', 'RepeatClient'];

export function KanbanBoard({ initialCompanies }: KanbanBoardProps) {
    const [companies, setCompanies] = useState(initialCompanies);

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        // Optimistic update
        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return; // Reordering within same list not implemented in backend yet

        const newCompanies = Array.from(companies);
        const companyIndex = newCompanies.findIndex(c => c.id === draggableId);
        if (companyIndex === -1) return;

        const company = newCompanies[companyIndex];
        const newStage = destination.droppableId as Company['pipelineStage'];

        company.pipelineStage = newStage;
        setCompanies(newCompanies);

        // Sync with backend
        await fetch('/api/crm/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(company)
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto h-[calc(100vh-120px)] pb-4 gap-4">
                {STAGES.map(stage => {
                    const stageCompanies = companies.filter(c => c.pipelineStage === stage);
                    return (
                        <Droppable key={stage} droppableId={stage}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold uppercase tracking-wider text-xs text-gray-500">{stage}</h3>
                                        <span className="bg-white text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">
                                            {stageCompanies.length}
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                                        {stageCompanies.map((company, index) => (
                                            <Draggable key={company.id} draggableId={company.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <CompanyCard company={company} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    )
                })}
            </div>
        </DragDropContext>
    );
}
